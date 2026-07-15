import Editor from "@monaco-editor/react";

const CodeEditor = ({
    fileTree,
    setFileTree,
    currentFile,
    saveTimeout,
    isRemoteUpdate,
    sendFileUpdate,
}) => {

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