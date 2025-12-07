import {z} from "zod"

export const usernameValidation = z
            .string()
            .min(2, 'Username must be at least 2 characters long')
            .max(15, 'Username must be at most 15 characters long')
            .regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi, 'Username can only contain letters, numbers, and underscores')

export const signInSchema = z.object({
    identifier: z.string({message: 'Please use a valid email or username.'}),
    password: z.string()
})