import { SidebarTrigger } from "./ui/sidebar";
import AuthComponents from "./AuthComponents";
import { useAppSelector } from "@/hooks/hooks";

// fixed top-0 left-0 w-full z-50 bg-[#212121]/80 backdrop-blur-md
export default function Header() {
  const { user } = useAppSelector((state) => state.auths);

  return (
    <nav className="flex justify-between items-center w-full p-4 shadow bg-sidebar">
      <SidebarTrigger />
      {user ? (
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold text-lg">
          {user.full_name[0].toUpperCase()}
        </div>
      ) : (
        <AuthComponents />
      )}
    </nav>
  );
}
