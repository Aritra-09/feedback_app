import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    code: string
): Promise<ApiResponse> {
    
    try {
        const data = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: email,
        subject: "Your Verification Code",
        react: VerificationEmail({username, code}),
        });
         return{
            success: true,
            message: 'Verification email sent successfully',
            data: data,
            status: 200,
        }
    } catch (error) {
        console.log('Error sending verification email:', error);
        return{
            success: false,
            message: 'Failed to send verification email',
            status: 500
        }
    }
}