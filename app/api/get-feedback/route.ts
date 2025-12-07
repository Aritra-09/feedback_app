import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import User from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { User as AuthUser } from "next-auth";
import mongoose from "mongoose";


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
        const user = await User.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(user_id)}},
            {$unwind: '$feedback'},
            {$sort: {'feedback.createdAt': -1}},
            {$group: {
                _id: '$_id',
                feedback: {$push: '$feedback'}
            }}
        ])

        if(!user || user.length === 0){
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found'
            }), {status: 404});
        }
        return new Response(JSON.stringify({
            success: true,
            feedbacks: user[0].feedback
        }), {status: 200});
        
    } catch (error) {
         return new Response(JSON.stringify({
            success: false,
            message: 'Error getting feedback'
        }), {status: 200});
    }
}