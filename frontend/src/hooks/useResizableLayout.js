import { useState } from "react";

const useResizableLayout = () => {

    const [chatWidth, setChatWidth] = useState(360);
    const [explorerWidth, setExplorerWidth] = useState(240);

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

    };

};

export default useResizableLayout;