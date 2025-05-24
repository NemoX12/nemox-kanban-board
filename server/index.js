const SERVER_PORT = 5542;
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const { sendMail } = require("./email");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const pendingSignups = {};

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5542/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await db.query("SELECT * FROM users WHERE username = $1", [
        profile.emails[0].value,
      ]);
      if (!user.rows.length) {
        await db.query(
          "INSERT INTO users (username, first_name, last_name, photo_url, is_verified) VALUES ($1, $2, $3, $4, $5)",
          [
            profile.emails[0].value,
            profile.name.givenName,
            profile.name.familyName,
            profile.photos?.[0]?.value || null,
            true,
          ]
        );
        user = await db.query("SELECT * FROM users WHERE username = $1", [
          profile.emails[0].value,
        ]);
      } else if (!user.rows[0].photo_url && profile.photos?.[0]?.value) {
        await db.query("UPDATE users SET photo_url = $1 WHERE username = $2", [
          profile.photos[0].value,
          profile.emails[0].value,
        ]);
        user = await db.query("SELECT * FROM users WHERE username = $1", [
          profile.emails[0].value,
        ]);
      }
      return done(null, user.rows[0]);
    }
  )
);

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

app.get("/board", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await db.query("SELECT * FROM tasks WHERE user_id = $1", [userId]);
    res.json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

app.post("/board", authMiddleware, async (req, res) => {
  try {
    const { content, status, creation_date, completion_date } = req.body;
    const userId = req.user.userId;
    await db.query(
      "INSERT INTO tasks (content, status, creation_date, completion_date, user_id) VALUES ($1, $2, $3, $4, $5)",
      [content, status, creation_date, completion_date, userId]
    );
    res.status(201).json("Created a task successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

app.put("/board/:id", authMiddleware, async (req, res) => {
  try {
    const { content, status, completion_date } = req.body;
    const fields = [];
    const values = [];
    let idx = 1;

    if (content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(content);
    }
    if (status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (completion_date !== undefined) {
      fields.push(`completion_date = $${idx++}`);
      values.push(completion_date);
    }

    if (fields.length === 0) {
      return res.status(400).json("No fields to update.");
    }

    values.push(req.params.id);
    const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${idx}`;
    await db.query(query, values);

    res.status(200).json("Updated a task successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

app.delete("/board/:id", authMiddleware, async (req, res) => {
  try {
    await db.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error");
  }
});

app.post("/auth/signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4)",
      [username, hashedPassword, firstName, lastName]
    );
    res.status(201).json({ message: "User created" });
  } catch (err) {
    if (err.code === "23505") {
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

app.post("/auth/signin", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });

  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
    });
    res.json({ message: "Authenticated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body;
  const userResult = await db.query("SELECT id FROM users WHERE username = $1", [email]);
  const user = userResult.rows[0];
  if (!user)
    return res.json({ message: "If that email exists, a reset link has been sent." });

  const now = new Date();

  const logsResult = await db.query(
    "SELECT sent_at FROM email_logs WHERE user_id = $1 ORDER BY sent_at DESC LIMIT 3",
    [user.id]
  );
  const logs = logsResult.rows;

  if (logs[0] && now - logs[0].sent_at < 60 * 1000) {
    return res
      .status(429)
      .json({ error: "Please wait at least 1 minute before requesting another email." });
  }

  const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
  const emailsIn15Min = logs.filter((log) => log.sent_at > fifteenMinutesAgo);
  if (emailsIn15Min.length >= 3) {
    return res
      .status(429)
      .json({ error: "You can only request 3 emails every 15 minutes." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600 * 1000);

  await db.query(
    "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3",
    [token, expiry, user.id]
  );

  await db.query(
    "INSERT INTO email_logs (user_id, email, sent_at) VALUES ($1, $2, NOW())",
    [user.id, email]
  );

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  await sendMail({
    to: email,
    subject: "Password Reset",
    text: `Reset your password: ${resetLink}`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  res.json({ message: "If that email exists, a reset link has been sent." });
});

app.post("/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await db.query(
    "SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
    [token]
  );
  const user = result.rows[0];
  if (!user) return res.status(400).json({ error: "Invalid or expired token" });

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.query(
    "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2",
    [hashed, user.id]
  );
  res.json({ message: "Password reset successful" });
});

app.post("/auth/request-signup", async (req, res) => {
  const { username, password, firstName, lastName } = req.body;

  const existing = await db.query("SELECT 1 FROM users WHERE username = $1", [username]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: "User with this email already exists." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  pendingSignups[username] = {
    firstName,
    lastName,
    password: await bcrypt.hash(password, 10),
    code,
    expiresAt: Date.now() + 15 * 60 * 1000,
  };
  await sendMail({
    to: username,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`,
  });
  res.json({ message: "Verification code sent to your email." });
});

app.post("/auth/verify-signup", async (req, res) => {
  const { username, code } = req.body;
  const pending = pendingSignups[username];
  if (!pending || pending.code !== code || Date.now() > pending.expiresAt) {
    return res.status(400).json({ error: "Invalid or expired code." });
  }

  await db.query(
    "INSERT INTO users (username, password, first_name, last_name, is_verified) VALUES ($1, $2, $3, $4, $5)",
    [username, pending.password, pending.firstName, pending.lastName, true]
  );
  delete pendingSignups[username];
  res.json({ message: "Account created and verified!" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.get("/auth/check", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT first_name, last_name, photo_url FROM users WHERE id = $1",
      [req.user.userId]
    );
    const user = result.rows[0];
    res.json({
      authenticated: true,
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      photoUrl: user?.photo_url || "",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ authenticated: false });
  }
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
    });
    res.redirect("http://localhost:3000/board");
  }
);

app.listen(SERVER_PORT, () => {
  console.log("✅ Server is running on port:", SERVER_PORT);
});
