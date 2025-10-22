'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { Size } from '@repo/ui/size'
import { Variant } from '@repo/ui/variant'

type AuthFormInputs = {
  name?: string
  email: string
  password: string
}

export default function Auth() {
  const { signUp, signIn, signOut, isLoading, error, clearError } = useAuth()
  const [isSignUpMode, setIsSignUpMode] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>()

  const onSubmit = async (data: AuthFormInputs) => {
    if (isSignUpMode) {
      const result = await signUp(data)
      console.log('Signed up:', result)
    } else {
      const result = await signIn({ email: data.email, password: data.password })
      console.log('Signed in:', result)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white border border-gray-200 rounded-xl shadow-sm px-8 py-10 text-gray-900">
      <h2 className="text-2xl font-semibold mb-6 text-center tracking-tight">
        {isSignUpMode ? 'Create Account' : 'Welcome Back'}
      </h2>

      {error && (
        <div className="mb-5 p-3 text-sm bg-red-50 border border-red-400 text-red-700 rounded-md flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 font-bold hover:text-red-700">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {isSignUpMode && (
          <Input
            type="text"
            placeholder="Name"
            size={Size.LARGE}
            variant={Variant.PRIMARY}
            className="w-full border-gray-300 focus:border-gray-800 focus:ring-0"
            {...register('name')}
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          className="w-full border-gray-300 focus:border-gray-800 focus:ring-0"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}

        <Input
          type="password"
          placeholder="Password"
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          className="w-full border-gray-300 focus:border-gray-800 focus:ring-0"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'At least 6 characters' },
          })}
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}

        <Button
          size={Size.LARGE}
          variant={Variant.PRIMARY}
          className="w-full bg-gray-900 text-white rounded-md hover:bg-black transition-colors duration-200"
        >
          {isLoading ? 'Loading...' : isSignUpMode ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsSignUpMode(!isSignUpMode)}
          className="text-gray-700 text-sm hover:text-black transition"
        >
          {isSignUpMode ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={signOut}
          className="text-xs text-gray-500 hover:text-gray-800 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
