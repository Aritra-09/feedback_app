'use client'
import { Button } from '@/components/ui/button'
import { Separator } from '@radix-ui/react-separator'
import Link from 'next/link'
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse';
import React, { useState } from 'react'
import { feedbackSchema } from '@/schemas/feedbackSchema';
import { useParams } from 'next/navigation';
import z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { useCompletion } from '@ai-sdk/react';
import { Lightbulb } from "lucide-react";


const specialChar = "||"

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

function UserPage() {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(initialMessageString)

  const params = useParams()
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema)
  });

  const feedbackContent = form.watch('content')

  const handleMessageClick = (feedback: string) => {
    form.setValue('content', feedback)
  }

  
  const onSubmit = async function name(data: z.infer<typeof feedbackSchema>) {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/send-feedback`, {
        username: username,
        ...data
      })

      if (response.data.success) {
        toast.success('Feedback sent successfully!', { duration: 3000 })
      }
      form.reset({ ...form.getValues(), content: '' });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response) {
        console.log(axiosError.response?.data.message)
        toast.error(axiosError.response?.data.message, { duration: 3000 })
      } else {
        toast.error('Error sending feedback', { duration: 3000 })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  const fetchSuggestedMessages = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/suggest-feedbacks`)
      console.log(response.data.data)
      setFeedback(response.data.data)
      console.log(parseStringMessages(feedback));
      

    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    } finally{
      setIsLoading(false)
    }
  };



  return (
    <div className="container mx-auto my-20 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-lg">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg'>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none text-lg"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className='text-lg' type="submit" disabled={isSubmitting || !feedbackContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <Separator className="my-6" />
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Suggested Feedback
          </h2>

          {/* Suggest Button */}
          <Button
          onClick={fetchSuggestedMessages}
          disabled={isLoading}
          
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            <Lightbulb size={18} />
            Suggest Feedback
          </Button>
        </div>

        <p className="text-gray-600 mb-6 text-sm">
          Not sure what to write? Here are some suggestions you can use for inspiration:
        </p>

        {/* Suggestion List */}
        <div className="space-y-10 flex flex-col">
          {/* feedbacks  */}
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : 
          (
            parseStringMessages(feedback).map((message, index) => (
              <Button
                  key={index}
                  variant="outline"
                  className="my-2 text-base"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
            ))
          )}
        </div>
      </div>
      <div className="text-center text-lg mt-10">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button className='text-lg'>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default UserPage