const ChatMessage = ({ msg, user, WriteAiMessage }) => {

    return (
        <div
            className={`${msg.sender._id === "AI" ? "max-w-80" : "max-w-52"}
            ${msg.sender._id === user?._id ? "ml-auto" : ""}
            message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
        >
            <small className="opacity-65 text-xs">
                {msg.sender.email}
            </small>

            <div className="text-sm">
                {
                    msg.sender._id === "AI"
                        ? WriteAiMessage(msg.message)
                        : <p>{msg.message}</p>
                }
            </div>
        </div>
    );

};

export default ChatMessage;