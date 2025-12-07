import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";


export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect();

                try {
                    const user = await User.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with the given email or username");
                    }

                    if (!user.isVerified) {
                        throw new Error("User email is not verified, please verify your email before logging in");
                    }

                    const isPasswordCorrect =  await bcrypt.compare(credentials.password, user.password)

                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password");
                    } else{
                        return user;
                    }

                } catch (error: any) {
                    console.error("Error in authorize function:", error);
                    throw new Error("Internal server error", error);
                }
            }
        })
    ],
    callbacks:{
        async session({ session, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingFeedback = token.isAcceptingFeedback;
                session.user.username = token.username;
            }

        return session
        },
        async jwt({ token, user }) {

            if(user){
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingFeedback = user.isAcceptingFeedback;
                token.username = user.username;
            }

        return token
        }
    },
    pages:{
        signIn: '/signin',
    },
    session:{
        strategy:'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}