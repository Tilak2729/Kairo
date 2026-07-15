const ChatMessage = ({ msg, user, WriteAiMessage }) => {

    return (
        <div
            className={`${msg.sender._id === "AI" ? "max-w-[90%]" : "max-w-[78%]"}
            ${msg.sender._id === user?._id ? "ml-auto" : ""}
            message flex flex-col gap-1 p-2.5 w-fit min-w-0 rounded-md border ${
                msg.sender._id === user?._id
                    ? "bg-[#094771] border-[#0e5a8f] text-[#e6e6e6]"
                    : "bg-[#2d2d2d] border-[#3c3c3c] text-[#cccccc]"
            }`}
        >
            <small className="opacity-60 text-[10px] font-mono tracking-wide uppercase">
                {msg.sender.email}
            </small>

            <div
                className="text-sm leading-relaxed break-words min-w-0
                [&_pre]:!whitespace-pre-wrap [&_pre]:!break-words [&_pre]:!overflow-x-visible [&_pre]:!overflow-visible [&_pre]:!max-w-full
                [&_code]:!whitespace-pre-wrap [&_code]:!break-words [&_code]:!max-w-full
                [&_*]:!max-w-full"
            >
                {
                    msg.sender._id === "AI"
                        ? WriteAiMessage(msg.message)
                        : <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                }
            </div>
        </div>
    );

};

export default ChatMessage;