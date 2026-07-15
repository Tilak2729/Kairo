import Divider from "./Divider";

const Workspace = ({
    left,
    center,
    chatWidth,
    startChatResize,
}) => {

    return (

        <div className="flex flex-1 overflow-hidden h-full">

            <div
                style={{ width: `${chatWidth}px` }}
                className="h-full flex-shrink-0"
            >
                {left}
            </div>

            <Divider
                onMouseDown={startChatResize}
            />

            <div className="flex-1 h-full overflow-hidden">

                {center}

            </div>

        </div>

    );

};

export default Workspace;