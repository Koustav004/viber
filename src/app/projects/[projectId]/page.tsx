import { ProjectView } from "@/modules/projects/ui/views/projectView";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { tr } from "zod/v4/locales";
interface Props {
    params: Promise<{
        projectId: string;
    }>
};

const Page = async ({params}: Props) => {
    const { projectId } = await params;
    const quertClient = getQueryClient();
    void quertClient.prefetchQuery(trpc.messages.getMany
        .queryOptions({
            projectId,
    }));
    void quertClient.prefetchQuery(trpc.projects.getOne
        .queryOptions({
            id: projectId,
    }));
    return (
        <HydrationBoundary state={ dehydrate(quertClient)}>
            <Suspense fallback={<p>Loading...</p>}>
                <ProjectView projectId={projectId}/>
            </Suspense>
        </HydrationBoundary>
    );
};

export default Page;