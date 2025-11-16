import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function AuthComponents() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer rounded-2xl">
          Log in
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
            <DialogTitle>
                Welcome to Intellix
            </DialogTitle>
            <DialogDescription>
                Please log in to your account or sign up to get started.
            </DialogDescription>
        </DialogHeader>

        <Tabs>
            <TabsList>
                <TabsTrigger value="login">
                    Log In
                </TabsTrigger>
                <TabsTrigger value="signup">
                    Sign Up
                </TabsTrigger>
            </TabsList>

            <TabsContent value="login">

            </TabsContent>

            <TabsContent value="signup">
                
            </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
