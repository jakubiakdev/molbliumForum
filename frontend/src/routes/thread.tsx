import { NavLink, useParams } from "react-router";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import TimeAgo from 'react-timeago'
import fetchData from "../util/fetchData";
import PostCreation from "../components/PostCreation";
import { ArrowBendUpLeft } from "@phosphor-icons/react";


const threadQuery = (id: any) => ({
    queryKey: ['thread', id],
    queryFn: () => fetchData.thread(id),
})

export const loader = (queryClient: QueryClient) => async ({ params }: any) => {
    const query = threadQuery(params.id) // fetch thread here
    return (
        queryClient.ensureQueryData({ ...query, revalidateIfStale: true })
    )
}

function User({ user }: { user: any }) { // TODO: find if we need to use a similar design anywhere else
    return (
        <div>
            <p className="font-bold">{user.displayName}</p>
            <p className="text-sm text-gray-500 font-mono">({user.username})</p>
        </div>
    )
}

export default function Thread() {
    const queryClient = useQueryClient() // idk if necessary
    const params = useParams()
    const postResults = useQuery(threadQuery(params.id))
    if (params.id == undefined) return <div>something went very wrong</div>
    console.log(fetchData.thread(1))
    console.log(postResults.data)
    console.log(queryClient.getQueryData(['thread', params.id]))
    if (postResults.isLoading) return <div>Loading...</div>
    if (postResults.isError) return <div>Error!</div>
    if (!postResults.data) return <div>No data!</div>
    return (
        <div className="lg:w-5/6 mx-auto">
            <div className="py-5">
                <NavLink to="/threads" className="flex items-center gap-2 text-gray-400 hover:underline"><ArrowBendUpLeft size={16} />Go back to threads</NavLink>
                <h2 className="text-4xl">{postResults.data.thread.title}</h2>
                <h3>By <span className="font-bold">{postResults.data.thread.displayName}</span> <span className="font-mono text-sm text-gray-600">({postResults.data.thread.username})</span> <TimeAgo date={postResults.data.thread.createdAt} /></h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {postResults.data.posts.map((post: any) => (
                    <div key={post.id} className="flex flex-col md:flex-row bg-slate-800 rounded-sm">
                        <div className="w-full md:w-1/3 min-w-[2ch] p-5 overflow-hidden break-all border-b border-slate-500 md:border-0">
                            <User user={{ displayName: post.displayName, username: post.username }} />
                            <TimeAgo date={post.createdAt} />
                        </div>
                        <p className="w-full md:border-l p-5 border-slate-500">{post.content}</p>
                    </div>
                ))}
                <PostCreation threadId={params.id} />
            </div>
        </div>
    )
}
