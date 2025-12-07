import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { User as AuthUser } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
        const user = session?.user as AuthUser;

        if(!session || !session.user){
            return new Response(JSON.stringify({
                success: false,
                message: 'User is Unauthorized'
            }), {status: 401});
        }

        const user_id = user?._id

        const {acceptFeedbacks} = await request.json();

    try {

        const updatedUser = await User.findByIdAndUpdate(user_id, {
            isAcceptingFeedback: acceptFeedbacks
        }, {new: true});

        if(!updatedUser){
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), {status: 404});
        } else{
            if(updatedUser.isAcceptingFeedback) {
                return new Response(JSON.stringify({
                success: true,
                message: 'Feedback preference enabled successfully',
                updatedUser,
            }), {status: 200});
            } else {
                return new Response(JSON.stringify({
                success: true,
                message: 'Feedback preference disabled successfully',
                updatedUser,
            }), {status: 200});
            }
            
        }

    } catch (error) {
        console.error('Error accepting feedback preference:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error updating feedback preference'
        }), {status: 500});
    }
}


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
        const user = session?.user as AuthUser;

        if(!session || !session.user){
            return new Response(JSON.stringify({
                success: false,
                message: 'User is Unauthorized'
            }), {status: 401});
        }

        const user_id = user?._id

        try {
            const user = await User.findById(user_id);

            if(!user){
                return new Response(JSON.stringify({
                    success: false, 
                    message: 'User not found'
                }), {status: 404});
            } else {
                return new Response(JSON.stringify({
                    success: true,
                    isAcceptingFeedback: user.isAcceptingFeedback,
                }), {status: 200});
            }
        } catch (error) {
        console.error('Error getting accepting feedback preference:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error getting feedback preference'
        }), {status: 500});
        }
    
    
}