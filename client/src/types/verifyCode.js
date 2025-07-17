import * as z from "zod";

export default z.object({
  code: z
    .string()
    .min(6, "Verification code should be of 6 characters long")
    .max(6, "Verification code should be of 6 characters long"),
});
