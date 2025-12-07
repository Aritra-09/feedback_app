import z from "zod";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import {verifySchema} from "@/schemas/verifySchema";


const verificationCodeSchema = z.object({
    code: verifySchema
})

export async function POST(request: Request) {
    await dbConnect();
    try {

        const {username, code} = await request.json();

        const decodedUsername = decodeURIComponent(username)

        const user = await User.findOne({
            username: decodedUsername,
        })

        if(!user){
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), {status: 404});
        }

       const isCodeValid = user.verifyCode === code;
       const isCodeNotExpired = user.verifyCodeExpiry && user.verifyCodeExpiry > new Date();

       if(isCodeValid && isCodeNotExpired){
            user.isVerified = true;
            await user.save();
            
            return new Response(JSON.stringify({
                success: true,
                message: 'User verified successfully'
            }), {status: 200});
       }

       if(!isCodeValid){
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid verification code'
            }), {status: 400});
       }

       if(!isCodeNotExpired){
            return new Response(JSON.stringify({
                success: false,
                message: 'Verification code has expired'
            }), {status: 400});
       }
        
    } catch (error) {
        console.error('User verification error. Code does not match', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error checking user verification'
        }), {status: 500});
    }
}