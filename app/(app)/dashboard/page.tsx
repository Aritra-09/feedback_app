"use client"
import FeedbackCard from '@/components/FeedbackCard';
import { Feedback } from '@/model/User';
import { User } from 'next-auth';
import { acceptFeedbackSchema } from '@/schemas/acceptFeedbackSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { Axios, AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner'
import { Copy, RefreshCcw, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from 'next/navigation';
import LoginRequired from '@/components/LoginRequired';


function Dashboard() {
  let skeleton = true
  const feedbackSkeleton = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
   const route = useRouter()

  const handleDeteleFeedback = (feedbackId: string) => {
    setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback._id !== feedbackId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptFeedbackSchema)
  });

  const { register, watch, setValue } = form;

  const acceptFeedbacks = watch('acceptFeedbacks');

  const fetchAcceptFeedbacks = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<ApiResponse>(`/api/accept-feedback`)
      if (response.data.isAcceptingFeedback)
        setValue("acceptFeedbacks", response.data.isAcceptingFeedback)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching feedback settings');
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchFeedbacks = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>(`/api/get-feedback`)
      setFeedbacks(response.data.feedbacks || [])
      if (refresh) {
        toast.success('Feedbacks refreshed successfully');
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      console.log(axiosError.response?.data.message || 'Error fetching feedback settings');
    } finally {
      setTimeout( () => {
        setIsLoading(false);
      }, 2000)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setFeedbacks])

  useEffect(() => {
    if (!session || !session.user) {
      return
    }
    fetchFeedbacks()
    fetchAcceptFeedbacks()

  }, [setValue, session, fetchAcceptFeedbacks, fetchFeedbacks])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>(`/api/accept-feedback`, {
        acceptFeedbacks: !acceptFeedbacks
      })
      setValue('acceptFeedbacks', !acceptFeedbacks)
      toast.message(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || 'Error fetching feedback settings');
    }
  }

  // const {username} = session?.user as User
  const username = session?.user.username

  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('URL copied', {
      description: "Profile url copied to clipboard successfully"
    })
  }

  if (!session || !session.user) {
    return <LoginRequired/>
  }

  return (
    <>
      <div className="max-w-5xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Feedback Dashboard
          </h2>

          <div className="flex items-center gap-3">
            {/* Copy Link Field */}
            <div className="flex items-center border rounded-lg overflow-hidden">
              <input
                type="text"
                value={profileUrl}
                placeholder="https://example.com/feedback"
                className="p-2 text-sm w-56 outline-none text-gray-600"
                readOnly
              />
              <Button onClick={copyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white p-2 transition">
                <Copy size={18} />
              </Button>
            </div>

            {/* Refresh Button */}
            <button
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              onClick={(e) => {
                e.preventDefault();
                fetchFeedbacks(true);
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh
            </button>

            {/* Toggle Button */}
            <div className="flex items-center space-x-2">
              <Switch
                {...register('acceptFeedbacks')}
                checked={acceptFeedbacks}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading} />
              <Label htmlFor="airplane-mode">Accept Feedback: {acceptFeedbacks ? "On" : "Off"}</Label>
            </div>
          </div>
        </div>

        {/* Feedback List */}
      </div>

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl border border-gray-200">
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Recent Feedbacks
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sample Feedback Cards */}
            {isLoading ? (
              feedbackSkeleton.map((index) => (
                <div key={index} className="flex-col items-center my-10 mx-10">
                <div className="flex space-y-24 space-x-10 w-full max-w-sm">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-8 w-[50px]" />
                </div>
                  <Skeleton className="h-4 w-[250px]" />
              </div>
              ))) : (
                feedbacks.length > 0 ?
              (
                feedbacks.map((feedback, index) => (
                  <FeedbackCard
                    key={index}
                    feedback={feedback}
                    onFeedbackDelete={handleDeteleFeedback}
                  />
                ))
              ) :
              (<p>No feedbacks to display.</p>)
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;