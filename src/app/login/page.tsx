"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

const LoginPage = () => {

  const myWixClient = useWixClient();
  const isLoggedIn = myWixClient.auth.loggedIn();
  const router = useRouter()

  if(isLoggedIn){
    router.push("/");
  }


  const [mode, setMode] = useState(MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, seteMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register Your User"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

  let response;
    try {

      switch(mode) {
        case MODE.LOGIN: 
         response = await myWixClient.auth.login({
          email,
          password
        });
        break;

        case MODE.REGISTER: 
        response = await myWixClient.auth.register({
         email,
         password,
         profile:{nickname: username},
       });
       break;

        case MODE.RESET_PASSWORD: 
        response = await myWixClient.auth.sendPasswordResetEmail(
          email,
          window.location.href
        );
        seteMessage("Reset Password email sent, please check your inbox.")
        break;

        case MODE.EMAIL_VERIFICATION: 
        response = await myWixClient.auth.processVerification({
          verificationCode: emailCode,
      });
        break;
        default:
          break;
      
      }

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          seteMessage("Successfull! Redirecting to main page");
          const tokens = await myWixClient.auth.getMemberTokensForDirectLogin(response.data.sessionToken!);
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {expires:2});
          myWixClient.auth.setTokens(tokens);
          router.push("/");
          break; 
        case LoginState.FAILURE:
          if(response.errorCode=='invalidEmail' || response.errorCode == 'invalidPassword') {
            setError("Invalid Email Or Password");
          }
          else if(response.errorCode=='emailAlreadyExists'){
            setError("Email already exists");
          }
          else if(response.errorCode=='resetPassword'){
            setError("You need to reset password");
          }
          else setError("Something went wrong");
        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);
        case LoginState.OWNER_APPROVAL_REQUIRED:
          seteMessage("Your account is pending approval");
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
    }
    finally{
      setIsLoading(false);
    }
  }    

  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
      <form className="flex flex-col gap-8 w-96" onSubmit = {handleSubmit} action="">
        <h1 className="font-2xl font-semibold">{formTitle}</h1>
        {mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="John"
              className="ring-2 ring-gray-300 rounded-md p-4 "
              onChange={e=>setUsername(e.target.value)}
            />
          </div>
        ) : null}
        {mode !== MODE.EMAIL_VERIFICATION ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="John@gmail.com"
              className="ring-2 ring-gray-300 rounded-md p-4 "
              onChange={e=>setEmail(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Verification Code</label>
            <input
              type="text"
              name="emailCode"
              placeholder="Code"
              className="ring-2 ring-gray-300 rounded-md p-4 "
              onChange={e=>setEmailCode(e.target.value)}
            />
          </div>
        )}
        {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="ring-2 ring-gray-300 rounded-md p-4 "
              onChange={e=>setPassword(e.target.value)}
            />
          </div>
        ) : null}
        {mode === MODE.LOGIN ? <div onClick={() => setMode(MODE.RESET_PASSWORD)} className='text-sm underline cursor-pointer'>Forgot Password?</div> : null}
        <button
          className="bg-lama rounded-md text-white p-2 disabled:bg-pink-200 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Loading" : buttonTitle}
        </button>

        {error && <div className="text-red-500">{error}</div>}
        {mode === MODE.LOGIN && (
          <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.REGISTER)}>
            {"Don't"} have an account? Register here!
          </div>
        )}
        {mode === MODE.REGISTER && (
          <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.LOGIN)}>
            Already have an account? Login here!
          </div>
        )}
        {mode === MODE.RESET_PASSWORD && (
          <div className="text-sm underline cursor-pointer" onClick={() => setMode(MODE.LOGIN)}>
            Go back to Login
          </div>
        )}
        {message && <div className="text-green-500 text-sm">{message}</div>}
      </form>
    </div>
  );
};

export default LoginPage;
