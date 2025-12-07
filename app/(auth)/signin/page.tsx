'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'
import { toast } from "sonner"
import {useRouter} from 'next/navigation'

import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Form } from '@/components/ui/form'
import {FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  //zod

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues:{
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async function name(data: z.infer<typeof signInSchema>) {
    setIsSubmitting(true)

      const response = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      })
      
      if (response?.error) {
        if (response.error === 'CredentialsSignin') {
          toast.error('Invalid email/username or password', { duration: 3000 })
        } else {
          toast.error(response.error, { duration: 3000 })
        }
      }

      if (response?.url) {
        toast.success('Logged in successfully!', { duration: 3000 })
        router.push('/dashboard')
      }

  }
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Welcome Back To Anonymous Feedbacks
      </h2>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Username Field */}
        <FormField
          control={form.control}
          name="identifier"
          render={({field}) => (
          <FormItem>
            <FormLabel>Email / Username</FormLabel>
            <FormControl>
              <Input placeholder="email or username"
              {...field} 
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

        <Button type="submit" disabled={isSubmitting} className='w-full'>
          {isSubmitting ? 
          (<>     
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loging In
          </>
        ) : ('Sign In')}
        </Button>
      </form>
    </Form>
    
    <p className="text-sm text-center text-gray-600 mt-4">
        New User? Not a Member{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Register Now
        </Link>
    </p>
      
    </div>
  )
}

export default SignInPage