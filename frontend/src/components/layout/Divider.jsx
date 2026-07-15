const Divider = ({ onMouseDown }) => {

    return (

        <div
            onMouseDown={onMouseDown}
            className="group relative w-[1px] bg-[#2d2d2d] hover:bg-[#3794ff] active:bg-[#3794ff] cursor-col-resize transition-colors duration-150 flex-shrink-0"
        >
            {/* wider invisible hit-area so the handle is easy to grab without widening the visible seam */}
            <div className="absolute inset-y-0 -left-1.5 -right-1.5" />
        </div>

    );

};

export default Divider;