import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const Verify = () => {
  const navigate = useNavigate()
  // Get the token from URL parameters directly
  const token = new URLSearchParams(window.location.search).get('token')
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const verificationAttempted = useRef(false)
  
  const { 
    verifyEmail, 
    isVerifyLoading, 
    isVerifyError, 
    verifyErrorMessage 
  } = useAuth()
  
  useEffect(() => {
    // Only run verification once
    if (verificationAttempted.current) {
      return
    }
    
    const verifyUserEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided')
        return
      }
      
      try {
        verificationAttempted.current = true
        setStatus('loading')
        
        // Call the verifyEmail function
        try {
          const response = await verifyEmail(token)
          setStatus('success')
          setMessage(response?.message || 'Email verified successfully')
        } catch (error) {
          // Special handling for 204 status (No Content) - treat as success
          if (error?.response?.status === 204) {
            setStatus('success')
            setMessage('Email verified successfully')
          } else {
            throw error
          }
        }
      } catch (error) {
        setStatus('error')
        setMessage(
          error?.response?.data?.message || 
          error?.message || 
          'Email verifikasi gagal, Silahkan hubungi admin'
        )
      }
    }
    
    verifyUserEmail()
  }, [token, verifyEmail])
  
  const redirectToLogin = () => {
    navigate({ to: "/" });
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        {/* <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verifikasi</CardTitle>
          <CardDescription>
            Verifikasi email kamu
          </CardDescription>
        </CardHeader> */}
        
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          {(status === 'loading' || isVerifyLoading) && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-16 h-16 animate-spin text-primary" />
              <p className="text-lg">Memverifikasi email kamu...</p>
            </div>
          )}
          
          {(status === 'error' || isVerifyError) && status !== 'success' && (
            <div className="flex flex-col items-center gap-3">
              <AlertCircle className="w-16 h-16 text-destructive" />
              <p className="text-lg font-medium text-destructive">Verifikasi gagal</p>
              <p className="text-sm text-muted-foreground">
                {message || verifyErrorMessage || 'Unable to verify your email address'}
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-16 h-16 text-green-600" />
              <p className="text-lg font-medium text-green-600">Email Verifikasi Berhasil</p>
              <p className="text-sm text-muted-foreground">
                {message || 'Your account has been activated. You can now login to your account.'}
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button 
            size="lg" 
            onClick={redirectToLogin}
            className="px-6 py-2 bg-gradient-to-b from-[#FE8300] to-[#ED3400] text-white rounded-full hover:opacity-90 transition-opacity"
          >
            Lanjutkan Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Verify