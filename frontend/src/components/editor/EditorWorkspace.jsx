import Divider from "../layout/Divider";
import ExplorerPanel from "./ExplorerPanel";
import CodeEditor from "./CodeEditor";
import EditorTabs from "./EditorTabs";

const getFileIcon = (filename) => {
    if (!filename) return "ri-file-line text-[#858585]";
    if (filename.endsWith(".html")) return "ri-html5-line text-[#e34c26]";
    if (filename.endsWith(".css")) return "ri-css3-line text-[#3794ff]";
    if (filename.endsWith(".js") || filename.endsWith(".jsx")) return "ri-javascript-line text-[#e8c547]";
    if (filename.endsWith(".json")) return "ri-braces-line text-[#e8c547]";
    return "ri-file-line text-[#858585]";
};

const EditorWorkspace = ({
fileTree,
    setFileTree,
    currentFile,
    setCurrentFile,
    openFiles,
    handleCloseTab,
    handleFileOpen,
    saveTimeout,
    isRemoteUpdate,
    sendFileUpdate,
    onCreateFiles,
    explorerWidth,
    startExplorerResize,
    isExplorerCollapsed,
    toggleExplorer,
}) => {

    return (

        <section className="flex flex-col flex-1 h-full min-h-0 bg-[#1e1e1e] text-[#cccccc]">

            {/* Tab bar */}

{/* Editor Header */}

<div className="flex items-center h-9 px-3 border-b border-[#2d2d2d] bg-[#252526]">

    <div className="flex items-center gap-2 text-[13px] text-[#cccccc]">

        <i className="ri-code-s-slash-line text-[#3794ff]"></i>

        <span className="font-medium">
            Kairo Editor
        </span>

    </div>

</div>

            {/* Workspace */}

            <div className="flex flex-1 min-h-0 overflow-hidden">

<ExplorerPanel
    fileTree={fileTree}
    currentFile={currentFile}
    onCreateFiles={onCreateFiles}
    explorerWidth={explorerWidth}
    isExplorerCollapsed={isExplorerCollapsed}
    toggleExplorer={toggleExplorer}
    handleFileOpen={handleFileOpen}

/>

{
    !isExplorerCollapsed && (

        <Divider
            onMouseDown={startExplorerResize}
        />

    )
}

<div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">

    <EditorTabs
        openFiles={openFiles}
        currentFile={currentFile}
        setCurrentFile={setCurrentFile}
        handleCloseTab={handleCloseTab}
    />

    <div className="flex-1 min-h-0 overflow-hidden">
        <CodeEditor
            fileTree={fileTree}
            setFileTree={setFileTree}
            currentFile={currentFile}
            saveTimeout={saveTimeout}
            isRemoteUpdate={isRemoteUpdate}
            sendFileUpdate={sendFileUpdate}
        />
    </div>

</div>

            </div>

        </section>

    );

};

export default EditorWorkspace;