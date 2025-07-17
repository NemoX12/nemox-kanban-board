import * as z from "zod";

export default z.object({
  firstName: z
    .string()
    .min(2, "First name should be longer than 2 characters!")
    .max(100, "First name should be shorter than 100 characters!"),
  lastName: z
    .string()
    .min(2, "Last name should be longer than 2 characters!")
    .max(100, "Last name should be shorter than 100 characters!"),
  username: z
    .email("Enter a valid email!")
    .min(1, "Email should be longer than 1 character!")
    .max(100, "Email should be shorter than 100 characters!"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must be at least 8 characters, including a capital letter and a number!"
    )
    .max(255, "Password should be shorter than 255 characters!"),
});
