import Divider from "./Divider";

const Workspace = ({
    left,
    center,
    chatWidth,
    startChatResize,
    isChatCollapsed,
    toggleChat,
}) => {

    return (

        <div className="flex flex-1 overflow-hidden h-full">

<div
    style={{ width: `${chatWidth}px` }}
    className="relative h-full flex-shrink-0 transition-all duration-300 overflow-hidden"
>

<div className={isChatCollapsed ? "hidden" : "h-full"}>
        {left}
    </div>

{isChatCollapsed && (
    <button
        onClick={toggleChat}
        className="absolute inset-0 bg-slate-800 text-white hover:bg-slate-700"
    >
        ▶
    </button>
)}

</div>

{

    !isChatCollapsed && (

        <Divider
            onMouseDown={startChatResize}
        />

    )

}

            <div className="flex-1 h-full overflow-hidden">

                {center}

            </div>

        </div>

    );

};

export default Workspace;