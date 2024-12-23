import EnterOtpPage from "./enterOtp"
import { confirmEmail, getPendingUser } from "@/server/actions/auth";

export default async function ConfirmPage() {
  const pendingEmail = await getPendingUser();

  const handleOtp = async (otp: string) => {
    "use server";
    await confirmEmail(pendingEmail ?? '', otp);
  }
  
  if (pendingEmail !== undefined) {
    return <EnterOtpPage email={pendingEmail ?? ''} handleConfirm={handleOtp} />;
  } else {
    return <h1>Code has expired, please try logging in again.</h1>
  }
}
