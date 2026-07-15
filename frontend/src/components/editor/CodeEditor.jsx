import Editor from "@monaco-editor/react";

const CodeEditor = ({
    fileTree,
    setFileTree,
    currentFile,
    saveTimeout,
    isRemoteUpdate,
    sendFileUpdate,
}) => {

    if (!currentFile) {

        return (

            <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] text-[#858585] gap-2">

                <i className="ri-file-code-line text-4xl"></i>

                <p className="text-sm">
                    Select a file to start editing
                </p>

            </div>

        );

    }

    return (

        <div className="flex-1">

            <Editor
                height="100%"
                theme="vs-dark"
                language={
                    currentFile?.endsWith(".html")
                        ? "html"
                        : currentFile?.endsWith(".css")
                        ? "css"
                        : "javascript"
                }
                value={
                    currentFile
                        ? fileTree[currentFile]?.file?.contents
                        : ""
                }
                options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, monospace",
                    minimap: { enabled: true },
                    padding: { top: 12 },
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                }}
                onChange={(value) => {

                    if (!currentFile) return;

                    if (isRemoteUpdate.current) {

                        isRemoteUpdate.current = false;
                        return;

                    }

                    const updatedFileTree = {

                        ...fileTree,

                        [currentFile]: {

                            ...fileTree[currentFile],

                            file: {

                                ...fileTree[currentFile].file,

                                contents: value,

                            },

                        },

                    };

                    setFileTree(updatedFileTree);

                    if (saveTimeout.current) {
                        clearTimeout(saveTimeout.current);
                    }

                    saveTimeout.current = setTimeout(() => {

                        sendFileUpdate(updatedFileTree);

                        console.log("Auto Saved");

                    }, 1000);

                }}
            />

        </div>

    );

};

export default CodeEditor;