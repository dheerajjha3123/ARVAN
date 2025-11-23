"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import AuthLayout from "@/components/AuthLayout"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useResetPassword } from "@/app/new-password/hooks/hooks"

// Password validation schema
const NewPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

const NewPassword = ({id}: {id: string}) => {
    const { mutate, isPending: isLoading } = useResetPassword()
 
  const router = useRouter()

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
    try {
      
      // Replace with your actual password update logic
     await mutate({password:values.password,token:id})

      // Redirect to login or confirmation page
      router.push("/signin")
    } catch (error) {
      console.error(error)
    } finally {
     
    }
  }

  return (
    <AuthLayout>
      <>
        <div className="mb-8 text-center">
          <h1 className="text-4xl sm:text-4xl font-bold mb-1">Enter a New Password</h1>
          <p className="text-gray-400 text-lg sm:text-xl">Password Must Contain At Least 8 Characters</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="bg-transparent space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        type="password"
                        placeholder="New Password"
                        className="w-full p-4 sm:p-5 text-white bg-transparent border-0 rounded-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm ml-2" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="rounded-xl border-2 border-lime-400 bg-gradient-to-r from-[#2e470fb4] via-[#3a5b0bc9] to-[#3a5b0b49]">
                      <Input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full p-4 sm:p-5 text-white bg-transparent border-0 rounded-xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        disabled={isLoading}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400 text-sm ml-2" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full p-3 text-black font-bold text-lg rounded-xl bg-lime-400 shadow-[0_4px_20px_rgba(255,255,255,0.6)] hover:bg-lime-500"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </form>
        </Form>
      </>
    </AuthLayout>
  )
}

export default NewPassword

