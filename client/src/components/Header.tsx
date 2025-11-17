import { SidebarTrigger } from "./ui/sidebar";
import AuthComponents from "./AuthComponents";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { toast } from "react-toastify";
import { logout } from "@/redux/slice/authSlice";

// fixed top-0 left-0 w-full z-50 bg-[#212121]/80 backdrop-blur-md
export default function Header() {
  const { user } = useAppSelector((state) => state.auths);

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  }

  return (
    <nav className="flex justify-between items-center w-full pr-10 pl-4 py-4 shadow bg-sidebar">
      <SidebarTrigger />
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-10 h-10 rounded-full cursor-pointer bg-gray-800 flex items-center justify-center text-white font-semibold text-lg">
              {user.full_name[0].toUpperCase()}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={5}>
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOutIcon />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <AuthComponents />
      )}
    </nav>
  );
}
