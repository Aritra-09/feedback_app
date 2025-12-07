"use client"
import React, {useState} from 'react'
import { useRouter, useParams } from 'next/navigation'
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { verifySchema } from '@/schemas/verifySchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form } from '@/components/ui/form'
import {FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'

function VerifyAccount() {
    const router = useRouter()
    const params = useParams()

    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues:{
          code: ''
        }
      })


    const onSubmit = async function name(data: z.infer<typeof verifySchema>) {
        setIsSubmitting(true)
        try {
            const response = await axios.post(`/api/verify-code`, {
                    username: params.username,
                    code: data.code
            })

            if(response.data.success){
                toast.success('Account verified successfully!',{ duration: 3000 })
                router.push('/signin')
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
   <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
        Verify Your Account
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Enter the 6-digit code we sent to your email.
      </p>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {/* Username Field */}
        <FormField
          control={form.control}
          name="code"
          render={({field}) => (
          <FormItem>
              <FormLabel>Verification Code</FormLabel>
            <FormControl>
              <Input placeholder="code" 
              {...field} 
              onChange={(e) => {
                field.onChange(e)
              }}
              />
            </FormControl>

            
            <FormMessage />
          </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className='w-full'>
          {isSubmitting ? 
          (<>     
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />Checking
          </>
        ) : ('Verify Account')}
        </Button>
        </form>
    </Form>
    </div>
  )
}

export default VerifyAccount;