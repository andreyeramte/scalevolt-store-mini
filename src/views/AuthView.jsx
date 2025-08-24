import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import authService from '../services/authService'

function AuthView() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const googleButtonRef = useRef(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })

  // Initialize Google Sign-In when component mounts
  useEffect(() => {
    const initGoogleAuth = async () => {
      try {
        setIsLoading(true)
        await authService.initGoogleSignIn()
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error)
        setAuthError('Failed to initialize Google Sign-In')
      } finally {
        setIsLoading(false)
      }
    }

    initGoogleAuth()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLogin) {
      // Handle login
      console.log('Login:', { email: formData.email, password: formData.password })
    } else {
      // Handle signup
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        return
      }
      console.log('Signup:', formData)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }



  const loginWithApple = () => {
    // TODO: integrate with backend/Supabase OAuth
    alert('Apple Sign-In (to be connected to backend)')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? (
              <>
                Or{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  create a new account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    value={formData.firstName}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tl-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="First name"
                  />
                  <input
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    value={formData.lastName}
                    onChange={handleChange}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-tr-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Last name"
                  />
                </div>
              </>
            )}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isLogin ? 'rounded-none' : 'rounded-t-md'} focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
              placeholder="Email address"
            />
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isLogin ? 'rounded-none' : 'rounded-b-md'} focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm`}
              placeholder="Password"
            />
            {!isLogin && (
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required={!isLogin}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm password"
              />
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Forgot your password?
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isLogin ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>

        {/* Social login */}
        <div className="space-y-3">
          <div
            ref={googleButtonRef}
            id="google-signin-button"
            className="w-full flex items-center justify-center"
          ></div>
          <button
            onClick={loginWithApple}
            className="w-full flex items-center justify-center gap-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
          >
            <img src="/Login/apple-login-icon.svg" alt="Apple" className="w-5 h-5" />
            <span className="font-medium">Continue with Apple</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthView
