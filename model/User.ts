import mongoose, {Schema, Document} from "mongoose";


export interface Feedback extends Document{
    content: string;
    createdAt: Date;

}

const FeedbackSchema: Schema<Feedback> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
}, {_id: true})

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string | null;
    verifyCodeExpiry: Date | null;
    isVerified: boolean;
    isAcceptingFeedback: boolean;
    feedback : Feedback[];

}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [ true, 'Username is required' ],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g , 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    isAcceptingFeedback: {
        type: Boolean,
        default: false,
        required: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: true,
        default: Date.now,
    },
    feedback: [FeedbackSchema]
})


const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);
export default User;