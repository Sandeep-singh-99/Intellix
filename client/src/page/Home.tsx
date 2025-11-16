import ChatMessageInput from "@/components/ChatMessageInput";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#212121] text-white w-full">
        <div className="flex justify-center items-end h-screen pb-20">
            <ChatMessageInput />
        </div>
    </div>
  )
}
