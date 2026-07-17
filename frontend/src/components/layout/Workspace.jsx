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

        <div className="flex flex-1 overflow-hidden h-full bg-[#1e1e1e]">

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
        title="Show chat"
        className="group absolute inset-0 bg-[#252526] hover:bg-[#2a2d2e] text-[#858585] hover:text-[#3794ff] transition-colors duration-150 flex flex-col items-center pt-3 gap-2 border-r border-[#2d2d2d]"
    >
        <i className="ri-chat-3-line text-lg transition-transform duration-150 group-hover:scale-110"></i>
        <i className="ri-arrow-right-s-line text-base"></i>
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

            <div className="flex-1 h-full min-w-0 min-h-0 overflow-hidden">

                {center}

            </div>

        </div>

    );

};

export default Workspace;