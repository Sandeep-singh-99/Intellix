import { Send, Smile } from "lucide-react";

export default function ChatMessageInput() {
  return (
    <div className="w-full bg-[#212121] border-t border-[#2e2e2e] flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-3 bg-[#2a2a2a] border border-[#3a3a3a] rounded-3xl px-5 py-3 shadow-[0_0_15px_rgba(0,0,0,0.2)]">
          

          {/* Input */}
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500 text-base"
          />

          {/* Emoji */}
          <button className="text-gray-400 hover:text-white transition">
            <Smile size={20} />
          </button>

          {/* Send */}
          <button className="bg-[#3a8bff] hover:bg-[#3275d3] active:scale-95 transition text-white p-2 rounded-2xl">
            <Send size={18} />
          </button>
        </div>
        
      </div>
    </div>
  );
}
