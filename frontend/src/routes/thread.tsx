import { useParams } from "react-router";
import { QueryClient, useQuery } from "@tanstack/react-query";
import fetchThread from "../util/fetchThread";

const threadQuery = (id: any) => ({
    queryKey: ['thread', id],
    queryFn: () => fetchThread(id),
})

export const loader = (queryClient: QueryClient) => async ({ params }: any) => {
    const query = threadQuery(params.id) // fetch thread here
    return (
        queryClient.ensureQueryData({...query, revalidateIfStale: true})
    )
}

export default function Thread() {
    const params = useParams()
    const query = useQuery(threadQuery(params.id))
    return (
        <div>
            <h1>{query.data.thread.title}</h1>
            {query.data.posts.map((post: any) => (
                JSON.stringify(post)
            ))}
        </div>
    )
}
