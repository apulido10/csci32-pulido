'use client'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@repo/ui/button'
import {Input} from '@repo/ui/input'
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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormInputs>({
    defaultValues: { name: '', email: '', password: '' },
  })

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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isSignUpMode ? 'Sign Up' : 'Sign In'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button onClick={clearError} className="ml-2 text-red-500 hover:text-red-700">×</button>
        </div>
      )}

      <form className="space-y-4">
        {isSignUpMode && (
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name (optional)"
                size={Size.LARGE}
                variant={Variant.PRIMARY}
                value={field.value}
                setValue={field.onChange}
              />
            )}
          />
        )}

        <Controller
          name="email"
          control={control}
          rules={{ required: 'Email is required' }}
          render={({ field }) => (
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              size={Size.LARGE}
              variant={Variant.PRIMARY}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

        <Controller
          name="password"
          control={control}
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } }}
          render={({ field }) => (
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              size={Size.LARGE}
              variant={Variant.PRIMARY}
              value={field.value}
              setValue={field.onChange}
            />
          )}
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

        <div className="w-full">
          <Button
            onClick={handleSubmit(onSubmit)}
            size={Size.LARGE}
            variant={Variant.PRIMARY}
            className="w-full"
          >
            {isLoading ? 'Loading...' : isSignUpMode ? 'Sign Up' : 'Sign In'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setIsSignUpMode(!isSignUpMode)}
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
        >
          {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={signOut}
          className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
