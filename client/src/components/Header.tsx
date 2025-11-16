import AuthComponents from "./AuthComponents";
import { SidebarTrigger } from "./ui/sidebar";

// fixed top-0 left-0 w-full z-50 bg-[#212121]/80 backdrop-blur-md
export default function Header() {
  return (
    <nav className="flex justify-between items-center w-full p-4 shadow bg-sidebar">
      <SidebarTrigger />
      <AuthComponents />
    </nav>
  );
}
