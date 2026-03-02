"use client"

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MessagesContainer } from "../components/messagesContainer";
import { useTRPC } from "@/trpc/client"
import { useState } from "react";
import { ProjectHeader } from "../components/projectHeader";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup
} from "@/components/ui/resizable"
import { Fragment } from "@/generated/prisma";
import { FragmentWeb } from "../components/fragmentWeb";

interface Props{
    projectId: string;
};

export const ProjectView = ({projectId}: Props) => {
    const[activeFragment, setActiveFragment] = useState<Fragment | null>(null);


    return (
        <div className="h-screen">
                <ResizablePanelGroup  className="h-full w-full flex flex-col">
                    <ResizablePanel
                        defaultSize={20}
                        minSize={15}
                        className="flex flex-col min-h-0"
                    >
                        <Suspense fallback={<p>Loading Project...</p>}>
                        <ProjectHeader projectId={projectId} />
                        </Suspense>
                        <Suspense fallback={<p>Loading Messages...</p>}>
                            <MessagesContainer 
                            projectId={projectId}
                            activeFragment={activeFragment}
                            setActiveFragment={setActiveFragment}
                            />
                        </Suspense>
                    </ResizablePanel>
                    <ResizableHandle withHandle/>
                    <ResizablePanel
                        defaultSize={65}
                        minSize={50}
                    >
                        {!!activeFragment && <FragmentWeb data = {activeFragment} />}
                    </ResizablePanel>
                </ResizablePanelGroup>
        </div>
    )
}