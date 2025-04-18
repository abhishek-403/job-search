import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router";
import logo from "@/assets/samarthanam_logo_nobg.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Loader from "@/utils/Loader";
import { useGetUserProfileImg } from "@/lib/hooks/useQueries";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firbaseConfig";

const UserAvatar = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useNavigate();
  const { data: user, isLoading, refetch } = useGetUserProfileImg();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      refetch();
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || (isAuthenticated && isLoading)) {
    return <Loader />;
  }

  return (
    <>
      {isAuthenticated ? (
        <Avatar
          onClick={() => router("/profile")}
          className="md:h-12 md:w-12 cursor-pointer aspect-square border border-zinc-700 mr-4"
        >
          {user?.img ? (
            <AvatarImage src={user.img} alt="Profile" />
          ) : (
            <AvatarFallback className="bg-zinc-800 text-zinc-400">
              {user?.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          )}
        </Avatar>
      ) : (
        <div
          onClick={() => router("/login")}
          className="border border-zinc-800  mr-4 px-4 py-2 rounded-full cursor-pointer hover:bg-zinc-800 transition-all duration-200"
        >
          Login
        </div>
      )}
    </>
  );
};
export const Navbar = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);

  // useMotionValueEvent(scrollYProgress, "change", (current: any) => {
  //   // Check if current is not undefined and is a number
  //   if (typeof current === "number") {
  //     let direction = current! - scrollYProgress.getPrevious()!;

  //     if (scrollYProgress.get() < 0.05) {
  //       setVisible(false);
  //     } else {
  //       if (direction < 0) {
  //         setVisible(true);
  //       } else {
  //         setVisible(false);
  //       }
  //     }
  //   }
  // });

  return (
    <motion.div
      initial={{
        opacity: 1,
        y: -100,
      }}
      animate={{
        y: visible ? 0 : -100,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className="py-6 px-20 center  z-[999] w-full"
    >
      <div>
        <img src={logo} className="h-12 invert" />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{
            opacity: 1,
            y: -100,
          }}
          animate={{
            y: visible ? 0 : -100,
            opacity: visible ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "flex max-w-fit top-4 inset-x-0 mx-auto border  border-white/[0.2] rounded-full bg-black shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
            className
          )}
        >
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              to={navItem.link}
              className={cn(
                "relative:text-neutral-50 items-center flex space-x-1 :hover:text-neutral-300 "
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block text-sm">{navItem.name}</span>
            </Link>
          ))}
          <button className="border text-sm font-medium relative :border-white/[0.2] :text-white px-4 py-2 rounded-full">
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
          </button>
        </motion.div>
      </AnimatePresence>
      <div>
        <UserAvatar />
      </div>
    </motion.div>
  );
};
