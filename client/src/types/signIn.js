import * as z from "zod";

export default z.object({
  username: z
    .email("Enter a valid email!")
    .min(1, "Email should be longer than 1 character!")
    .max(100, "Email should be shorter than 100 characters!"),
  password: z.string().max(255, "Password should be shorter than 255 characters!"),
});
