import * as z from "zod";

export default z.object({
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must be at least 8 characters, including a capital letter and a number!"
    )
    .max(255, "Password should be shorter than 255 characters!"),
});
