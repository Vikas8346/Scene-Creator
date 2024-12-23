"use client"

import { useState } from "react"
import { Button } from "@/components/ui/otp-button"
import { useSearchParams } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function EnterOtpPage({
  email,
  handleConfirm
} : {
  email: string;
  handleConfirm: (otp: string) => void;
}) {
  const params = useSearchParams()
  const message = params.get('message') ?? ''
  const [otp, setOtp] = useState("")

  const handleResend = () => {
    // Implement resend OTP logic here
    console.log('Resending OTP')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col w-full max-w-lg mx-auto p-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold ">Enter OTP.</h1>
          {message && <p className="text-destructive">{message}</p>}
          <p className="text-foreground">Please check <span className="font-bold">{email}</span> for a confirmation code.</p>
          <p className="text-foreground">Enter your OTP to verify.</p>
        </div>
        
        <div className="space-y-8">
        <InputOTP 
          value={otp} 
          onChange={setOtp} 
          maxLength={6}
          className="mb-8 shadow-md"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        
        <div className="w-40 flex flex-col">
        <Button 
          variant="link" 
          className="p-0 h-auto text-sm justify-start text-purple-600 mb-4" 
          onClick={handleResend}
        >
          Resend OTP
        </Button>
        
        <Button 
          variant="nextWithEnter"
          className="font-semibold"
          onClick={() => handleConfirm(otp)}
          onEnterPress={() => handleConfirm(otp)}
        >
          Verify
        </Button>
        </div>
        </div>
      </div>
    </div>
  )
}
