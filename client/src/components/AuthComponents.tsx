import { Loader, Lock, Mail, User2Icon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { toast } from "react-toastify";
import { login, register } from "@/redux/slice/authSlice";
import type { AxiosError } from "axios";

export default function AuthComponents() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      await dispatch(login(formData)).unwrap();
      toast.success("Login successful");
      setOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      const errorMessage =
        axiosError.response?.data?.detail || "Invalid Credentials";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("full_name", formData.full_name);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      await dispatch(register(formDataObj)).unwrap();
      toast.success("Registration successful");
      setOpen(false);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail: string }>;
      const errorMessage =
        axiosError.response?.data?.detail || "Invalid Credentials";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer rounded-2xl">
          Log in
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to Intellix</DialogTitle>
          <DialogDescription>
            Please log in to your account or sign up to get started.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-sidebar rounded-lg p-1">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div className="grid gap-2 w-full">
                <Label htmlFor="email">Email ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="email"
                    placeholder="Enter your Email ID"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-[#111b30] border-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2 w-full">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="password"
                    placeholder="Enter your Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-[#111b30] border-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-between mt-6">
                <DialogClose asChild>
                  <Button variant="secondary" className="rounded-lg">
                    Close
                  </Button>
                </DialogClose>
                <Button type="submit" className="rounded-lg" disabled={loading}>
                  {loading && <Loader className="animate-spin" />}
                  Log In
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-4" onSubmit={handleSignUpSubmit}>
              <div className="grid gap-2 w-full">
                <Label htmlFor="full_name">UserName</Label>
                <div className="relative">
                  <User2Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="full_name"
                    placeholder="Enter your UserName"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="pl-10 bg-[#111b30] border-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2 w-full">
                <Label htmlFor="email">Email ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="email"
                    placeholder="Enter your Email ID"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-[#111b30] border-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2 w-full">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="password"
                    placeholder="Enter your Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-[#111b30] border-gray-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>
            </form>
            <DialogFooter className="flex justify-between mt-6">
              <DialogClose asChild>
                <Button variant="secondary" className="rounded-lg">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-lg" disabled={loading}>
                {loading && <Loader className="animate-spin" />}
                Sign Up
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
