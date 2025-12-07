import User from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Feedback } from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();

    const {username, content} = await request.json();

    try {
        const user = await User.findOne({username: username});
        console.log(user);
        

        if (!user){
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), {status: 404});
        }

        
        if(!user.isAcceptingFeedback){
            return new Response(JSON.stringify({
                success: false,
                message: 'User is not accepting feedback at the moment'
            }), {status: 403});
        }

        const newFeedback = {
            _id: new mongoose.Types.ObjectId(),
            content,
            createdAt: new Date(),
        }

        user.feedback.push(newFeedback as Feedback);
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            message: 'Feedback sent successfully'
        }), {status: 200});

    } catch (error) {
        console.error('Error adding feedback:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error adding feedback'
        }), {status: 500});
    }
}