import {z} from "zod"

export const feedbackSchema = z.object({
    content: z.string().min(10, 'Feedback must be at least 10 characters long').max(300, 'Feedback must be at most 300 characters long'),
})