import Hero from "@/components/Home/Hero";
import { Navbar } from "@/components/Navbar";
import { FaHome, FaUser } from "react-icons/fa";
import JobBoard from "../../components/Home/JobBoard";
import JobFilterMobile from "@/components/Home/JobFilter";

type Props = {};
const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <FaHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <FaUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <FaUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];

export default function Home({}: Props) {
  return (
    <div className="min-h-screen block w-full text-white ">
      <Navbar navItems={navItems} />
      <Hero/>
      {/* <div>
      </div>
      <div className="max-w-screen overflow-wrap break-words   ">
        <pre className="overflow-wrap break-words whitespace-pre-wrap">
          {user?.displayName}
        </pre>
      </div>

      <div>
        <button onClick={() => auth.signOut()}>logout</button>
      </div> */}
      {/* <JobFilterMobile/> */}
      <div className=" mt-[10px] ">
        <JobBoard/>

      </div>
    </div>
  );
}
