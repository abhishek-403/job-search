import { motion } from "framer-motion";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import googleIcon from "../../assets/googleicon.png";
import {
  auth,
  createUserWithEmailAndPassword,
  provider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "../../utils/firbaseConfig";

import { axiosClient } from "@/utils/axiosConfig";
import { loginSchema, signUpSchema } from "@/utils/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import BorderAnimation from "../../components/BorderAnimation";
import { formatFirebaseError } from "../../lib/constants/formattedErrors";
import Loader from "../../utils/Loader";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: any) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      if (isRegister) {
        let result = signUpSchema.safeParse({ email, password, name });

        if (!result.success) {
          const fieldErrors = result.error.format();
          setErrors({
            name: fieldErrors.name?._errors[0],
            email: fieldErrors.email?._errors[0],
            password: fieldErrors.password?._errors[0],
          });
          return;
        }

        await createUserWithEmailAndPassword(auth, email, password);

        await axiosClient.post(`/user/create-user`, {
          email,
          name,
        });
      } else {
        let result = loginSchema.safeParse({ email, password });

        if (!result.success) {
          const fieldErrors = result.error.format();
          setErrors({
            email: fieldErrors.email?._errors[0],
            password: fieldErrors.password?._errors[0],
          });
          return;
        }

        await signInWithEmailAndPassword(auth, email, password);
      }
      toast.success("Logged in successfully");
      navigate("/");
    } catch (err: any) {
      console.log(err);

      toast.error(formatFirebaseError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, provider);

      await axiosClient.post(`/user/google-login`, {
        name: auth.currentUser?.displayName,
        email: auth.currentUser?.email,
        profileImage: auth.currentUser?.photoURL,
      });

      toast.success("Logged in successfully");
      navigate("/");
    } catch (err: any) {
      toast.error(formatFirebaseError(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full relative items-center justify-center min-h-screen  font-inter text-white flex rounded-lg overflow-hidden md:px-12 px-4 mx-auto">
      <motion.div
        key={isRegister ? "register" : "login"}
        initial={{ opacity: 0, x: isRegister ? 80 : -80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isRegister ? -80 : 80 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 w-fit"
      >
        <BorderAnimation
          time={10}
          className="w-fit mx-auto rounded-[44px]"
          width={2}
        >
          <div className="w-[400px] md:w-[420px]   border-neutral-85 bg-gradient-to-br from-neutral-90 border-[2.5px] via-neutral-95 to-neutral-90 p-8 rounded-[44px]">
            <div className="mx-auto">
              <h2 className="text-2xl text-purple-500 font-bold text-center mb-8">
                {isRegister ? "Create an Account" : "Welcome Back"}
              </h2>

              <form autoComplete="off" onSubmit={handleAuth}>
                {isRegister && (
                  <div className="mb-4">
                    <input
                      type="name"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-3 outline-none rounded-lg bg-gray-800 border border-gray-700 text-white"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                )}
                <div className="mb-4">
                  <input
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 outline-none rounded-lg bg-gray-800 border border-gray-700 text-white"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="mb-8">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      autoComplete="off"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full p-3 outline-none rounded-lg bg-gray-800 border border-gray-700 text-white pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-0"
                    >
                      {password && (showPassword ? <FaEyeSlash /> : <FaEye />)}
                    </button>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-80 hover:bg-neutral-75 text-white font-medium py-3 px-4 rounded-lg transition duration-300 mb-6"
                  onClick={handleAuth}
                >
                  {isLoading ? <Loader /> : isRegister ? "Sign Up" : "Log In"}
                </button>
              </form>

              <div className="flex items-center justify-center mb-6">
                <div className="flex-grow h-px bg-neutral-80"></div>
                <span className="px-4 text-sm text-gray-400">OR</span>
                <div className="flex-grow h-px bg-neutral-80"></div>
              </div>

              <button
                onClick={googleLogin}
                className=" mx-auto rounded-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-80 hover:bg-neutral-75 text-white transition"
              >
                <img src={googleIcon} alt="Google Logo" className="w-[24px]" />
                <span className="text-base">
                  {isRegister ? " Sign up" : " Log in"} with Google
                </span>
              </button>

              <p className="text-center text-gray-400 mt-4">
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}
                <span
                  className="text-purple-400 cursor-pointer"
                  onClick={() => {
                    setErrors({});
                    setIsRegister(!isRegister);
                  }}
                >
                  {isRegister ? " Log in" : " Sign up"}
                </span>
              </p>
              <div
                onClick={() => navigate("/")}
                className="text-violet-400 w-fit mx-auto text-base center px-3 py-1 text-md cursor-pointer bg-neutral-80 hover:bg-neutral-75 rounded-lg mt-3"
              >
                Explore without login
              </div>
            </div>
          </div>
        </BorderAnimation>
      </motion.div>
      <div className="md:w-1/2  flex-col items-center justify-center  hidden md:p-12 ">
        <div className="mb-4">
          <svg viewBox="0 0 100 60" className="w-32 h-24 text-purple-300">
            <path
              d="M50 10 C30 10, 10 30, 10 40 L90 40 C90 30, 70 10, 50 10 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="50" cy="30" r="3" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-purple-300 tracking-wide">
          Morgon Stanley
        </h1>
        <p className="text-lg font-light tracking-widest text-purple-300 mt-1">
          Hackathon
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
