'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, ChevronLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authApi, getApiMessage, getStoredPhone } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

export default function VerifyPage() {
  const router = useRouter()
  const auth = useAuth()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!auth.loading && auth.token) {
      router.replace('/dashboard')
      return
    }

    if (auth.loading) return

    // Get phone number from session storage
    const phone = getStoredPhone()
    if (!phone) {
      router.push('/auth/login')
      return
    }
    setPhoneNumber(phone)
    
    // Focus first input
    inputRefs.current[0]?.focus()
  }, [auth.loading, auth.token, router])

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all digits entered
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      handleVerify(pastedData)
    }
  }

  const handleVerify = async (otpValue: string) => {
    setIsLoading(true)
    setError('')

    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP.')
      setIsLoading(false)
      return
    }

    try {
      const response = await authApi.verifyOtp(phoneNumber, otpValue)
      const token = response.token || response.Token
      if (!token) throw new Error('Token missing from login response')
      setIsVerified(true)
      toast.success('Verified successfully')
      await auth.login(token, response.userId, Boolean(response.profileComplete))
    } catch (err) {
      const message = getApiMessage(err, 'The OTP is invalid or expired. Please try again.')
      setError(message)
      toast.error(message)
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      await authApi.sendOtp(phoneNumber)
      setResendTimer(30)
      setOtp(['', '', '', '', '', ''])
      setError('')
      inputRefs.current[0]?.focus()
      toast.success('OTP resent')
    } catch (err) {
      const message = getApiMessage(err, 'Failed to resend OTP.')
      setError(message)
      toast.error(message)
    }
  }

  const maskedPhone = phoneNumber ? `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 5)}****${phoneNumber.slice(-2)}` : ''

  if (auth.loading || auth.token) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  return (
    <>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/20 via-background to-accent/20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="font-[family-name:var(--font-sora)] text-2xl font-bold">
              AptiRush
            </span>
          </Link>

          <h1 className="font-[family-name:var(--font-sora)] text-4xl xl:text-5xl font-bold mb-6 text-balance">
            Almost There!
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Verify Your Number
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-md text-pretty leading-relaxed">
            {"We've sent a 6-digit OTP to your phone. Enter it below to access your personalized learning dashboard."}
          </p>

          {/* Illustration placeholder */}
          <div className="w-64 h-64 rounded-3xl bg-card/30 border border-border/30 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Secure Verification</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - OTP form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Back button and mobile logo */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/auth/login')}
              className="p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Link href="/" className="flex lg:hidden items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-[family-name:var(--font-sora)] text-xl font-bold">
                AptiRush
              </span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isVerified ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="font-[family-name:var(--font-sora)] text-2xl font-bold mb-2">
                  Verified Successfully!
                </h2>
                <p className="text-muted-foreground">
                  Redirecting to dashboard...
                </p>
              </motion.div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold mb-2">
                    Enter OTP
                  </h2>
                  <p className="text-muted-foreground">
                    {"We've sent a verification code to"}{' '}
                    <span className="font-medium text-foreground">{maskedPhone}</span>
                  </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-between gap-2 sm:gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      disabled={isLoading}
                      className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-2xl bg-card border-2 transition-all duration-200 focus:outline-none focus:ring-0 ${
                        digit ? 'border-primary' : 'border-border/50'
                      } ${error ? 'border-destructive' : ''} ${
                        isLoading ? 'opacity-50' : ''
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive text-center mb-4"
                  >
                    {error}
                  </motion.p>
                )}

                <Button
                  onClick={() => handleVerify(otp.join(''))}
                  disabled={otp.some(d => d === '') || isLoading}
                  className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 mb-6"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Resend OTP in <span className="font-medium text-foreground">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:underline mx-auto"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Change number */}
                <p className="text-center text-sm text-muted-foreground mt-8">
                  Wrong number?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Change phone number
                  </Link>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  )
}
