"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getURL } from "@/utils/helpers";
import { AccountData } from "@/types/profiles";
import { cookies } from "next/headers";
import { PENDING_USER } from "@/constants/cookies";

/**
 * Logs a user in
 * @param email the email of the user
 * @param password the password of the user
 * returns null if successful, or an error message if not
 */
export async function login(email: string, password: string): Promise<string | null> {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  return error ? error.message : null;
}


/**
 * Registers a user
 * @param email the email of the user
 * @param password the password of the user
 * @returns null if successful, or an error message if not
 */
export async function register(email: string, password: string) : Promise<string | null> {
    const supabase = createClient();

    const userData = {
      email,
      password
    };

    const { data, error } = await supabase.auth.signUp(userData);

    if (error) {
      return error.message;
    }

    await setPendingUser(email);
  
    return null;
}

export async function setPendingUser(email: string) : Promise<void> {
  cookies().set(PENDING_USER, email, { 
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict',
    maxAge: 3600
  })
}

export async function getPendingUser() : Promise<string | undefined> {
  return cookies().get(PENDING_USER)?.value;
}

export async function deletePendingUser() : Promise<void> {
  cookies().delete(PENDING_USER);
}

/**
 * Logs a user out
 */
export async function logout() {
    const supabase = createClient();
  
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      redirect('/error?message=' + error.message);
    }

    redirect('/');
}

/**
 * Completes a user's account
 */
export async function completeAccount(data: AccountData) {
    const supabase = createClient();
    
    if (!data.firstName || !data.lastName) {
        return 'Please enter your first and last name';
    }

    const {error} = await supabase.auth.updateUser({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
      }
    });
    if (error) {
        return error.message;
    }

    return null;
}


/**
 * Updates a user's profile
 * @param data The updated user data
 * @returns null if successful, or an error message if not
 */
export async function updateProfile(data: Partial<AccountData>): Promise<string | null> {
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
        data: {
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined,
        }
    });

    if (error) {
        return error.message;
    }
    return null;
}


export async function linkVeChainWallet(userId: string, address: string): Promise<string | null> {
  const supabase = createClient();

  const { error } = await supabase
    .from('user_profiles')
    .upsert({ user_id: userId, vechain_address: address }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error linking VeChain address:', error);
    return error.message;
  }

  return null;
}

export async function getVeChainAddress(userId: string): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_profiles')
    .select('vechain_address')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching VeChain address:', error);
    return null;
  }

  return data?.vechain_address || null;
}

/**
 * Logs in a user with Google
 * @returns redirects to the home page if successful, and back to login page if not
 */
export async function loginWithGoogle(
) : Promise<void> {
  const supabase = createClient();

  const redirectUrl = getURL('/auth/callback');

  console.log("auth url: ", redirectUrl)
  console.log('ahahahaha')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    redirect('/login?message=' + error.message);
  }

  redirect(data.url)
}

/**
 * Confirms a user's email with OTP
 * @param email email of the user
 * @param otp otp of the user
 * @returns redirects to the home page if successful, and back to login page if not
 */
export async function confirmEmail(
  email: string,
  otp: string
) : Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'signup',
  });

  if (error) {
    redirect('/confirm?message=' + error.message);
  }

  await deletePendingUser();

  redirect('/additional-info');
}

