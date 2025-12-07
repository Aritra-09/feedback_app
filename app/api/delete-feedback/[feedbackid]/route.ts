import User from "@/model/User";
import {User as AuthUser} from 'next-auth'
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, {params}: {params: {feedbackid: string}}) {
    const {feedbackid} = await params
    console.log(feedbackid);
    

    await dbConnect();

    const session = await getServerSession(authOptions)
        const user = session?.user as AuthUser;

        if(!session || !session.user){
            return new Response(JSON.stringify({
                success: false,
                message: 'User is Unauthorized'
            }), {status: 401});
        }

    try {
       const updatedResult = await User.updateOne(
        {_id: user._id},
        {$pull: {feedback: {_id: feedbackid}}}
       )

       if(updatedResult.modifiedCount == 0) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Feedback not found or already deleted'
            }), {status: 404});
       }

       return new Response(JSON.stringify({
                success: true,
                message: 'Feedback deleted'
            }), {status: 200});

        
    } catch (error) {
        console.log('Error in delete feedback', error);
        
        return new Response(JSON.stringify({
                success: false,
                message: 'Error deleting feedback'
            }), {status: 500});
    }
} 