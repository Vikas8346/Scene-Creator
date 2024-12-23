// src/app/auth/register/registerForm.tsx

"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { register, loginWithGoogle, getVeChainAddress } from "@/server/actions/auth";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState<any>(null);
    const [veChainAddress, setVeChainAddress] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    setUser(session.user);
                    const address = await getVeChainAddress(session.user.id);
                    setVeChainAddress(address);
                } else {
                    setUser(null);
                    setVeChainAddress(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

        return (
        <Card className="flex flex-col bg-background mx-auto border-none max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl text-center"></CardTitle>
                <CardDescription className="text-m flex flex-col gap-4">
                    <Button 
                        variant="secondary" 
                        className="w-full gap-3"
                        onClick={() => loginWithGoogle()}
                    >
                        <Image
                            src={'/google.svg'}
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Register with Google
                    </Button>
                </CardDescription>
            </CardHeader>
            {/*}
        <div className="flex flex-row justify-center text-center items-center gap-4">
            <p className="w-1/5">Or</p>
        </div>
        <CardContent>
            <div className="grid gap-4">
                <p>{message}</p>
            <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <div className="flex items-start">
                <label htmlFor="password">Password</label>
                </div>
                <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <Button onClick={handleSubmit} type="submit" className="w-full">
                Register
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline">
                Login
            </Link>
            </div>
        </CardContent>
        {*/}
        </Card>
    )
}
