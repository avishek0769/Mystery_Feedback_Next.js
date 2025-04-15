import { z } from "zod";


export const messageSchema = z.object({
    content: z.string()
            .min(10, "Message should be of atleast 10 characters")
            .max(300, "Message should not be more than 300 characters")
})