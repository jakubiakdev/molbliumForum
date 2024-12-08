import React from "react";
import { CaretDoubleRight } from "@phosphor-icons/react";
import { NavLink } from "react-router";
import { QueryClient, useQueries, useQuery } from "@tanstack/react-query";
import fetchData from "../util/fetchData";
import TimeAgo from 'react-timeago'


const threadsQuery = () => ({
    queryKey: ['allThreads'],
    queryFn: () => fetchData.allThreads(),
})

export const loader = (queryClient: QueryClient) => async () => {
    const query = threadsQuery() // fetch thread here
    return (
        queryClient.ensureQueryData({ ...query, revalidateIfStale: true })
    )
}

export default function Threads() {
    const threads = useQuery(threadsQuery())

    if (threads.isLoading) return <div>Loading...</div>
    if (threads.isError) return <div>Error!</div>
    if (!threads.data) return <div>No data!</div>
    return (
        <table className="w-full">
            <thead className="text-left">
                <tr>
                    <th>Title</th>
                    <th>Replies</th>
                    <th>Date</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {threads.data.map((thread: any) => (

                    <tr className="bg-slate-800 border-b last:border-b-0 border-slate-500" key={thread.id}>
                        <td className="p-2">
                            <div className="w-full p-1">
                                <p className="text-lg mb-2">
                                    {thread.title}
                                </p>
                                <div className="flex text-sm items-center">
                                    {thread.tag && 
                                    <span style={{ background: thread.tagColor }} className="p-1 px-3 rounded-sm mr-2">{thread.tag}</span>
                                    }
                                    <div>
                                        <img src="https://cataas.com/cat?width=128&height=128" alt="" className="rounded-full inline-block size-6 ring-1 mr-1" />
                                        <span>{thread.displayName}</span>
                                        <span className="text-sm text-gray-600"> ({thread.username})</span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="p-2">todo</td>
                        <td className="p-2">
                            <p><TimeAgo date={thread.createdAt}/> </p>
                        </td>
                        <td>
                            <NavLink to={`/thread/${thread.id}`} className="p-2">
                                <CaretDoubleRight size={32} />
                            </NavLink>
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    )
}
