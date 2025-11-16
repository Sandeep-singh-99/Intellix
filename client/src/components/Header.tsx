import { Button } from "./ui/button";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0c1117]/80 backdrop-blur-md border-b border-gray-800">
        <div className=" mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-white text-3xl font-bold">Intellix</h1>

            <Button variant="default" className="cursor-pointer">
                Login
            </Button>

        </div>
    </nav>
  )
}
