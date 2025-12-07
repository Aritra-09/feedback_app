'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import {useRouter} from 'next/navigation'

import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form } from '@/components/ui/form'
import {FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function SignUpPage() {

  const [username, setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)

  const router = useRouter()

  //zod

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues:{
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username) {
        setisCheckingUsername(true)
        setUsernameMessage('')
        try {
          const response = await axios.get(`/api/check-unique-username?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>

          if(axiosError.response){
            setUsernameMessage(axiosError.response.data.message)
          } else {
            setUsernameMessage('Error checking username')
          }
        } finally {
          setisCheckingUsername(false)
        }
      }
    }

    checkUsernameAvailability();

  }, [username])

  const onSubmit = async function name(data: z.infer<typeof signUpSchema>) {
    setIsSubmitting(true)

    try {

      const response = await axios.post<ApiResponse>('/api/signup', data)
      
      if(response.data.success){
        toast.success('Account created successfully! Please check your email to verify your account.',{ duration: 3000 })
        router.push(`/verify/${username}`)
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      if(axiosError.response){
        console.log(axiosError.response?.data.message)
        toast.error(axiosError.response?.data.message,{ duration: 3000 })
      } else {
        toast.error('Error creating account',{ duration: 3000 })
      }
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Create an Account
      </h2>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
          <FormItem>
              <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="username" 
              {...field} 
              onChange={(e) => {
                field.onChange(e)
                debounced(e.target.value)
              }}
              />
            </FormControl>

            {isCheckingUsername && <Loader2 className="animate-spin mt-1" />}
            <p className={`text-sm ${usernameMessage === 'Username is available' ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="email" type='email'
              {...field} 
              onChange={(e) => {
                field.onChange(e)
              }}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input placeholder="password" type="password"
              {...field} 
              onChange={(e) => {
                field.onChange(e)
              }}
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || isCheckingUsername} className='w-full'>
          {isSubmitting ? 
          (<>     
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting
          </>
        ) : ('Sign Up')}
        </Button>
      </form>
    </Form>
    
    <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/signin" className="text-blue-600 hover:underline">
          Log in
        </Link>
    </p>
      
    </div>
  )
}

export default SignUpPage