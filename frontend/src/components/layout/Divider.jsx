const Divider = ({ onMouseDown }) => {

    return (

        <div
            onMouseDown={onMouseDown}
            className="w-[5px] bg-[#2d2d30] hover:bg-blue-500 cursor-col-resize transition-colors flex-shrink-0"
        />

    );

};

export default Divider;