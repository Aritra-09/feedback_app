import z from "zod";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";


export const uniqueUsernameSchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod //

        const result = uniqueUsernameSchema.safeParse(queryParam)
        console.log("SafeParse result",result);
        
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return new Response(JSON.stringify({
                success: false,
                message: 'Username must be 2-15 characters long and can only contain letters, numbers, hyphens, and underscores.'
            }), {status: 400});
        }


        const {username} = result.data;

        const existingVerifiedUserByUsername = await User.findOne({
            username: username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername){
            return new Response(JSON.stringify({
                success: false,
                message: 'Username is already taken'
            }), {status: 400});
        } else {
            return new Response(JSON.stringify({
            success: true,
            message: 'Username is available'
        }), {status: 200});
        }

        

    } catch (error) {
        console.error('Error checking username uniqueness:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error checking username'
        }), {status: 500});
    }
}