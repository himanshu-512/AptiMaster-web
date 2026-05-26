'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Zap, Phone, ArrowRight, Shield, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi, getApiMessage, STORAGE_KEYS } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const auth = useAuth()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!auth.loading && auth.token) {
      router.replace('/dashboard')
    }
  }, [auth.loading, auth.token, router])

  if (auth.loading || auth.token) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const phoneRegex = /^[6-9]\d{9}$/
    if (!phoneRegex.test(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian phone number')
      return
    }

    setIsLoading(true)

    try {
      const fullPhone = `+91${phoneNumber}`
      await authApi.sendOtp(fullPhone)
      setIsLoading(false)
      sessionStorage.setItem(STORAGE_KEYS.phone, fullPhone)
      toast.success('OTP sent successfully')
      router.push('/auth/verify')
    } catch (err) {
      setIsLoading(false)
      const message = getApiMessage(err, 'Failed to send OTP. Please try again.')
      setError(message)
      toast.error(message)
    }
  }

  return (
    <>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/20 via-background to-accent/20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/20 rounded-full blur-[80px]" />
        
        {/* Grid pattern */}
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
            Your Journey to
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Success Starts Here
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-md text-pretty leading-relaxed">
            Join thousands of aspirants who are achieving their exam goals with AI-powered practice and analytics.
          </p>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: '50K+', label: 'Practice Questions' },
              { icon: '10K+', label: 'Active Learners' },
              { icon: '95%', label: 'Success Rate' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-card/50 border border-border/50 flex items-center justify-center">
                  <span className="font-[family-name:var(--font-sora)] font-bold text-primary">{item.icon}</span>
                </div>
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8">
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-[family-name:var(--font-sora)] text-xl font-bold">
              AptiRush
            </span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h2 className="font-[family-name:var(--font-sora)] text-2xl sm:text-3xl font-bold mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Enter your phone number to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+91</span>
                    <div className="w-px h-5 bg-border" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter 10 digit number"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhoneNumber(value)
                      setError('')
                    }}
                    className="h-14 pl-28 text-lg rounded-2xl bg-card border-border/50 focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={phoneNumber.length !== 10 || isLoading}
                className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Get OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </form>

            {/* Security note */}
            <div className="flex items-center gap-2 mt-8 p-4 rounded-2xl bg-muted/50">
              <Shield className="w-5 h-5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground">
                Your phone number is secure with us. We only use it for login verification and important updates.
              </p>
            </div>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground mt-6">
              By continuing, you agree to our{' '}
              <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
