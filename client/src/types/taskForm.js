import * as z from "zod";

export default z.object({
  content: z
    .string()
    .min(1, "Task can't be empty!")
    .max(255, "Task should be shorter than 255 characters!"),
});
