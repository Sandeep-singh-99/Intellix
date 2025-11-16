import { Loader2, Lock, Mail, User2Icon } from "lucide-react";
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

export default function AuthComponents() {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog>
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
            <form className="space-y-4 ">
              <div className="grid gap-2 w-full">
                <Label htmlFor="email">Email ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="email"
                    placeholder="Enter your Email ID"
                    name="email"
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
              <Button className="rounded-lg" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Log In
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="signup">
            <form className="space-y-4 ">
              <div className="grid gap-2 w-full">
                <Label htmlFor="username">UserName</Label>
                <div className="relative">
                  <User2Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />
                  <Input
                    id="username"
                    placeholder="Enter your UserName"
                    name="username"
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
              <Button className="rounded-lg" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                Sign Up
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
