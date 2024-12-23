"use client";

import Link from "next/link";

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
import { useState } from "react";
import { login, loginWithGoogle } from "@/server/actions/auth";
import { toast } from "react-hot-toast";
import Image from "next/image";



export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const handleSubmit = async () => {
        const res = await login(email, password);

        if (res) {
            setMessage(res);
            toast.error(res, {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                    border: '2px solid #333',
                    color: '#fff',
                    backgroundColor: '#333',
                },
                });
        } else {
            toast.success('Successfully logged in!', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                    border: '2px solid #333',
                    color: '#fff',
                    backgroundColor: '#333',
                },
                });
            router.push('/');
        }

    }

    return (
        <Card className="flex flex-col bg-background mx-auto min-w-[400px] min-h-[450px] max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
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
                >
                </Image>
                Login with Google
            </Button>
            </CardDescription>
        </CardHeader>
        <div className="flex flex-row justify-center text-center items-center gap-4">
            <p className="w-1/5">Or</p>
        </div>
        <CardContent>
            <div className="grid gap-4">
                <label>{message}</label>
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
                <div className="flex items-center">
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
                Login
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
                Sign up
            </Link>
            </div>
        </CardContent>
        </Card>
    )
 
}
