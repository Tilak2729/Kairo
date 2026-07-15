import { useEffect } from "react";
import ChatMessage from "./ChatMessage";

const ChatPanel = ({
    messages,
    user,
    message,
    setMessage,
    send,
    typingUser,
    messageBox,
    WriteAiMessage,
    handleTyping,
}) => {
    useEffect(() => {
    if (messageBox.current) {
        messageBox.current.scrollTop = messageBox.current.scrollHeight;
    }
}, [messages, typingUser]);

    return (
        <div className="conversation-area pt-14 pb-14 flex-grow flex flex-col h-full w-full min-w-0 relative bg-[#1e1e1e]">

            <div
                ref={messageBox}
                className="message-box p-2 flex-grow flex flex-col gap-2 overflow-y-auto overflow-x-hidden max-h-full w-full min-w-0 scrollbar-hide"
            >

                {
                    messages.map((msg, index) => (

                        <ChatMessage
                            key={index}
                            msg={msg}
                            user={user}
                            WriteAiMessage={WriteAiMessage}
                        />

                    ))
                }

                {
                    typingUser && (

                        <div className="message flex flex-col gap-1 p-2.5 w-fit rounded-md max-w-[78%] bg-[#2d2d2d] border border-[#3c3c3c]">

                            <small className="opacity-60 text-[10px] font-mono tracking-wide uppercase">
                                {typingUser}
                            </small>

                            <div className="flex items-center gap-1 py-1 px-1">

                                <span className="w-1.5 h-1.5 bg-[#858585] rounded-full animate-bounce"></span>

                                <span
                                    className="w-1.5 h-1.5 bg-[#858585] rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></span>

                                <span
                                    className="w-1.5 h-1.5 bg-[#858585] rounded-full animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                ></span>

                            </div>

                        </div>

                    )
                }

            </div>

            <div className="inputField w-full flex items-center absolute bg-[#252526] border-t border-[#2d2d2d] bottom-0">

                <input
                    value={message}
                    onChange={(e) => {

                        setMessage(e.target.value);

                        handleTyping(e.target.value);

                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            send();
                        }
                    }}
                    className="p-2.5 px-4 border-none outline-none flex-grow bg-transparent text-[#cccccc] placeholder:text-[#6a6a6a] text-sm focus:bg-[#2a2d2e] transition-colors duration-100"
                    type="text"
                    placeholder="Enter message"
                />

                <button
                    onClick={send}
                    title="Send message"
                    className="px-5 h-full py-2.5 bg-[#0e639c] hover:bg-[#1177bb] text-white transition-colors duration-100 cursor-pointer"
                >
                    <i className="ri-send-plane-fill text-sm"></i>
                </button>

            </div>

        </div>
    );

};

export default ChatPanel;