import { useRef, useState } from "react";
const useResizableLayout = () => {

    const [chatWidth, setChatWidth] = useState(360);
    const [explorerWidth, setExplorerWidth] = useState(240);

const [isChatCollapsed, setIsChatCollapsed] = useState(false);
const previousChatWidth = useRef(360);
const [isExplorerCollapsed, setIsExplorerCollapsed] = useState(false);
const previousExplorerWidth = useRef(240);

    const startChatResize = (e) => {

        e.preventDefault();

        const handleMouseMove = (event) => {

            const newWidth = event.clientX;

            if (newWidth < 280 || newWidth > 600) return;

            setChatWidth(newWidth);

        };

        const handleMouseUp = () => {

            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);

            document.body.style.cursor = "default";
            document.body.style.userSelect = "auto";

        };

        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

    };

const toggleChat = () => {

    if (!isChatCollapsed) {

        previousChatWidth.current = chatWidth;

        setChatWidth(40);

        setIsChatCollapsed(true);

    } else {

        setChatWidth(previousChatWidth.current);

        setIsChatCollapsed(false);

    }

};

const toggleExplorer = () => {

    if (!isExplorerCollapsed) {

        previousExplorerWidth.current = explorerWidth;

        setExplorerWidth(40);

        setIsExplorerCollapsed(true);

    } else {

        setExplorerWidth(previousExplorerWidth.current);

        setIsExplorerCollapsed(false);

    }

};

const startExplorerResize = (e) => {

    e.preventDefault();

    const startX = e.clientX;
    const startWidth = explorerWidth;

    const handleMouseMove = (event) => {

        const delta = event.clientX - startX;

        const newWidth = startWidth + delta;

        if (newWidth < 180 || newWidth > 400) return;

        setExplorerWidth(newWidth);

    };

    const handleMouseUp = () => {

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";

    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

};

    return {

        chatWidth,
        explorerWidth,

        setChatWidth,
        setExplorerWidth,

        startChatResize,
        startExplorerResize,
        isChatCollapsed,
        toggleChat,
        isExplorerCollapsed,
toggleExplorer,

    };

};

export default useResizableLayout;