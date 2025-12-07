import { Feedback } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingFeedback?: boolean;
    feedbacks?: Array<Feedback>;
}