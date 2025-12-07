import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { tr } from "zod/locales";

export async function POST(request: NextRequest){
    await dbConnect();
    try {
        const {username, email, password} =  await request.json()
        console.log(username, email, password);
        
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();


        const existingVerifiedUserByUsername = await User.findOne({
        username: username, 
        isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return NextResponse.json({
                success: false,
                message: 'Username is already taken',
            }, {status: 400});
        }

       const existingUserByEmail =  await User.findOne({email: email})

       if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    success: false,
                    message: 'User is already registered with this email',
                }, {status: 400});
            } else {
                // Update existing unverified user with new details
                const hashedPassword = await bcrypt.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verificationCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

                await existingUserByEmail.save();
            }
       } else{
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode: verificationCode,
                isAcceptingFeedback: true,
                verifyCodeExpiry: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
                feedback: [],
            });

            const savedUser = await newUser.save();
            console.log('New user created:', savedUser);
            //send registration email
       }

       // send verification email
       const emailResponse = await sendVerificationEmail(email, username, verificationCode);

       if (!emailResponse.success) {
            return NextResponse.json({
                success: false,
                message: emailResponse.message,
            }, {status: 500});
       }

       return NextResponse.json({
            success: true,
            message: 'User registered successfully. Verify your email.',
       }, {status: 201});
        
        
    } catch (error) {
        console.error('Error in user registration', error);
        return NextResponse.json({
            success: false,
            message: 'Internal Server Error',
        }, {status: 500});  
    }
} 