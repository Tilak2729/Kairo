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
        <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">

            <div
                ref={messageBox}
                className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
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

                        <div className="message flex flex-col p-2 bg-slate-50 w-fit rounded-md max-w-52">

                            <small className="opacity-65 text-xs">
                                {typingUser}
                            </small>

                            <div className="flex items-center gap-1 py-1 px-1">

                                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>

                                <span
                                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></span>

                                <span
                                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                ></span>

                            </div>

                        </div>

                    )
                }

            </div>

            <div className="inputField w-full flex absolute bg-white bottom-0">

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
                    className="p-2 px-4 border-none outline-none flex-grow"
                    type="text"
                    placeholder="Enter message"
                />

                <button
                    onClick={send}
                    className="px-5 bg-slate-950 text-white"
                >
                    <i className="ri-send-plane-fill"></i>
                </button>

            </div>

        </div>
    );

};

export default ChatPanel;