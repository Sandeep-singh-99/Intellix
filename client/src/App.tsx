import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";

export default function App() {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <Header />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
