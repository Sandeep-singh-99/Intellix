import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { SidebarProvider } from "./components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import { ToastContainer } from "react-toastify";
import { useAppDispatch } from "./hooks/hooks";
import { useEffect } from "react";
import { currentUser } from "./redux/slice/authSlice";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);
  
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
          <Header />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
