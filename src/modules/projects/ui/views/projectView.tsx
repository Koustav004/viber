"use client"

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessagesContainer } from "../components/messagesContainer";
import { useTRPC } from "@/trpc/client"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"

interface Props{
    projectId: string;
};

export const ProjectView = ({projectId}: Props) => {
    // const trpc = useTRPC();
    // const { data: project } = useSuspenseQuery(trpc.messages.getOne.queryOptions({
    //     id: projectId,
    // }))


    return (
        <div className="h-screen">
                <ResizablePanelGroup  className="h-full w-full flex flex-col">
                    <ResizablePanel
                        defaultSize={35}
                        minSize={26}
                        className="flex flex-col min-h-0"
                    >
                        <Suspense fallback={<p>Loading Messages...</p>}>
                            <MessagesContainer projectId={projectId}/>
                        </Suspense>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel
                        defaultSize={65}
                        minSize={50}
                    >
                        TODO: Preview
                    </ResizablePanel>
                </ResizablePanelGroup>
        </div>
    )
}