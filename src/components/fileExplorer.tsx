import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "./codeView";
import { 
    ResizablePanel,
    ResizablePanelGroup,
    ResizableHandle 
} from "./ui/resizable";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbEllipsis,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./treeView";

type FileCollection = { [path: string]: string};

function getLanguageFromExtension(filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text";
};


interface FileExplorerProps {
    files: FileCollection
};

export const FileExplorer = ({
    files,
}: FileExplorerProps ) => {
    const [selectedFile, setSelectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    });

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);
    }, [files]);

    const handleFileSelect = useCallback((
        filePath: string
    ) => {
        if(files[filePath]){
            setSelectedFile(filePath);
        }
    }, [files])

    return(
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={20} className="bg-sidebar">
                <TreeView
                    data={treeData}
                    value={selectedFile}
                    onSelect={handleFileSelect}

                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors" />
            <ResizablePanel defaultSize={70} minSize={50}>
                {selectedFile && files[selectedFile] ? (
                    <div className="h-full w-full flex flex-col">
                        <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                            {/* File breadcrumb */}
                            <Hint text="Copy" side="bottom">
                                <Button
                                variant="outline"
                                size="icon"
                                className="ml-auto"
                                onClick={() => {}}
                                disabled={false}>
                                <CopyIcon />
                                </Button>
                            </Hint>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <CodeView
                            code={files[selectedFile]}
                            language={getLanguageFromExtension(selectedFile)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        Select A File &apos;s content
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
