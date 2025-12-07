import {z} from "zod"

export const usernameValidation = z
            .string()
            .min(2, 'Username must be at least 2 characters long')
            .max(15, 'Username must be at most 15 characters long')
            .regex(/[a-zA-Z][a-zA-Z0-9-_]{3,32}/gi, 'Username can only contain letters, numbers, and underscores')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.email({message: 'Please use a valid email address.'}),
    password: z.string().min(6, 'Password must be at least 6 characters long').max(20, 'Password must be at most 20 characters long')
})