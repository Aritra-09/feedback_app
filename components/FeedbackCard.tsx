"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Feedback } from '@/model/User'
import { toast } from 'sonner'

type FeedbackCardProps = {
    feedback: Feedback,
    onFeedbackDelete: (feedbackId: string) => void
}

function FeedbackCard( {feedback, onFeedbackDelete}: FeedbackCardProps) {

    const [open, setOpen] = useState(false)

    const handleDelete = async () => {
        console.log("Delete button clicked");
        console.log(feedback._id);
        
        const response = await axios.delete<ApiResponse>(`/api/delete-feedback/${feedback._id}`)
        toast.success(response.data.message)
        onFeedbackDelete(feedback._id as string)
        setOpen(false)
    }


    return (
        <div className='my-5 mx-10'>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Feedback</CardTitle>
                    <CardAction>
                        <AlertDialog open={open} onOpenChange={setOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your
                                        account and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardAction>
                </CardHeader>
                 <CardContent className='text-lg'>
                        {feedback.content}
                    </CardContent>
            </Card>
        </div>
    )
}

export default FeedbackCard