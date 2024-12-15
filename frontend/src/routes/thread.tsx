import { NavLink, useNavigate, useParams } from "react-router";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TimeAgo from 'react-timeago'
import fetchData from "../util/fetchData";
import PostCreation from "../components/PostCreation";
import { ArrowBendUpLeft, TrashSimple, Warning } from "@phosphor-icons/react";
import { useAuth } from "../AuthContext";
import { useEffect, useId, useState } from "react";
import { useNotice } from "../NoticeContext";


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


export default function Thread() {
    const queryClient = useQueryClient()
    const params = useParams()
    const results = useQuery(threadQuery(params.id))
    const auth = useAuth()
    const navigate = useNavigate()
    const [editingThread, setEditingThread] = useState(false);
    const [newTitle, setTitle] = useState('');
    const [newTag, setTag] = useState(0);
    const titleEditInputId = useId();
    const tagEditSelectId = useId();
    const notice = useNotice();

    const postMutation = useMutation({
        mutationFn: (postId: number) => {
            if (!auth?.getToken()) throw new Error('Not authenticated');
            return fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth?.getToken()}`
                }
            }).then(res => {
                if (res.status === 200) {
                    return
                } else {
                    throw new Error('Something went wrong');
                }
            })
        },
        mutationKey: ['deletePostFrom', params.id],
        onMutate: async (postId) => {
            console.log("inside onmutate")
            if (!auth?.getToken() || !auth.user) throw new Error('Not authenticated');
            await queryClient.cancelQueries({ queryKey: ['thread', params.id] });
            const previousThread = queryClient.getQueryData(['thread', params.id]);
            queryClient.setQueryData(['thread', params.id], (old: any) => {
                if (!old || !old.posts) {
                    return previousThread;
                }
                return {
                    ...old,
                    posts: old.posts.filter((post: any) => post.id !== postId)
                }
            })
            return { previousThread }
        },
        onSuccess: (data) => {
            console.log("success")
            queryClient.invalidateQueries({ queryKey: ['thread', params.id] });
        },
        onError: (error, newContent, context: any) => {
            console.error(error, newContent)
            queryClient.setQueryData(['thread', params.id], context.previousThread);
        },
        onSettled: () => {
            console.log("settled")
            queryClient.invalidateQueries({ queryKey: ['thread', params.id] });
        }
    })

    const tagsQuery = useQuery({
        queryKey: ['tags'],
        queryFn: fetchData.tags,
    })

    useEffect(() => {
        if (results.data?.thread?.title) {
            setTitle(results.data.thread.title);
        }
        if (results.data?.thread?.tagId) {
            setTag(results.data.thread.tagId);
        }
    }, [results.data.thread.tagId, results.data.thread.title]);

    const threadEditMutation = useMutation({
        mutationKey: ['editThread', params.id],
        mutationFn: ({ newTitle, newTag }: { newTitle: string, newTag: number }) => {
            if (!auth?.getToken()) throw new Error('Not authenticated');
            return fetch(`${process.env.REACT_APP_API_URL}/threads/${params.id}/edit`, {
                method: 'POST',
                body: JSON.stringify({ title: newTitle, tag: newTag }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth?.getToken()}`
                }
            }).then(res => {
                if (res.status === 200) {
                    return
                } else {
                    throw new Error('Something went wrong');
                }
            })
        },
        onMutate: async (newData) => {
            if (!auth?.getToken() || !auth.user) throw new Error('Not authenticated');
            await queryClient.cancelQueries({ queryKey: ['thread', params.id] });
            const previousThread = queryClient.getQueryData(['thread', params.id]);
            queryClient.setQueryData(['thread', params.id], (old: any) => {
                if (!old) {
                    return previousThread;
                }
                return {
                    ...old,
                    thread: {
                        ...old.thread,
                        title: newData.newTitle,
                        tagId: newData.newTag
                    }
                }
            })
            return { previousThread }
        },
        onSuccess: (data) => {
            notice.setMessage('Thread edited successfully!', 'success', 10000);
            console.log("success")
            setEditingThread(false);
            queryClient.invalidateQueries({ queryKey: ['thread', params.id] });
        },
        onError: (error, context: any) => {
            notice.setMessage(`Failed to edit thread: ${error}`, 'error', 10000);
            console.error(error)
            queryClient.setQueryData(['thread', params.id], context.previousThread);
        },
        onSettled: () => {
            console.log("settled")
            queryClient.invalidateQueries({ queryKey: ['thread', params.id] });
        }
    })

    const threadDeleteMutation = useMutation({
        mutationKey: ['deleteThread', params.id],
        mutationFn: () => {
            if (!auth?.getToken()) throw new Error('Not authenticated');
            return fetch(`${process.env.REACT_APP_API_URL}/threads/${params.id}/delete`, {
                method: 'POST',
                body: JSON.stringify({ title: newTitle, tag: newTag }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth?.getToken()}`
                }
            }).then(res => {
                if (res.status === 200) {
                    return
                } else {
                    throw new Error('Something went wrong');
                }
            })
        },
        onSuccess: (data, variables, context) => {
            console.log(data, variables, context)
            navigate("/threads");
            notice.setMessage(`Thread ${1} deleted successfully!`, 'success', 10000);
            console.log("success")
            queryClient.invalidateQueries({ queryKey: ['allThreads'] });
        },
        onError: (error, context: any) => {
            notice.setMessage(`Failed to delete thread: ${error}`, 'error', 10000);
            console.error(error)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['allThreads'] });
        }
    })

    if (params.id === undefined) return <div>Something went very wrong</div>


    if (results.isLoading) return <div>Loading...</div>
    if (results.isError) return <div>Error!</div>
    if (!results.data) return <div>No data!</div>
    return (
        <div className="lg:w-5/6 mx-auto">
            <div className="py-5">
                <NavLink to="/threads" className="flex items-center gap-2 text-gray-400 hover:underline"><ArrowBendUpLeft size={16} />Go back to threads</NavLink>
                {!editingThread ? (
                    <>
                        <h2 className="text-4xl">{results.data.thread.title}</h2>
                        <h3>By
                            <span className="font-bold"> {results.data.thread.displayName}</span>
                            <span className="font-mono text-sm text-gray-600"> ({results.data.thread.username}) </span>
                            <TimeAgo date={results.data.thread.createdAt} />
                        </h3>
                        {auth?.getToken() && auth?.user?.id === results.data.thread.authorId && (
                            <button onClick={() => setEditingThread(true)} className="text-blue-400 hover:underline">Edit thread</button>
                        )}
                    </>
                ) : (
                    <div className="border border-blue-400 p-2 rounded-sm">
                        <h2 className="text-4xl w-fit py-2">Editing thread</h2>
                        <div className="flex flex-row gap-2 items-center text-nowrap">
                            <label htmlFor={titleEditInputId}>New title:</label>
                            <input
                                type="text"
                                className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                                id={titleEditInputId}
                                value={newTitle}
                                onChange={e => setTitle(e.target.value)}
                            >
                            </input>
                            <label htmlFor={tagEditSelectId}>Tag: </label>
                            <select
                                className="w-1/4 bg-slate-800 p-2 my-2 rounded-sm border-transparent border" //transparent border to match input's height
                                value={newTag}
                                onChange={e => setTag(parseInt(e.target.value))}
                            >
                                <option value="0">None</option>
                                {!tagsQuery.isSuccess && <option>Please wait for tags to load...</option>}
                                {tagsQuery.data && tagsQuery.data.map((tag: any) => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                            <button className="bg-green-500 h-full p-2 rounded-sm" onClick={() => threadEditMutation.mutate({ newTitle, newTag })}>Save</button>
                        </div>
                        <div className="flex">
                            {/* TODO: this position is soooo stupid */}
                            {!threadEditMutation.isPending &&
                                <button onClick={() => setEditingThread(false)} className="text-blue-400 hover:underline">Cancel Editing</button>
                            }
                            <DeletionWarning onClick={() => threadDeleteMutation.mutate()} />
                        </div>
                    </div>
                )}

            </div>
            <div className="grid grid-cols-1 gap-2">
                {results.data.posts.map((post: any) => (
                    <div key={post.id} className="flex flex-col md:flex-row bg-slate-800 rounded-sm">
                        <div className="w-full md:w-2/5 min-w-[2ch] overflow-hidden break-all border-b border-slate-500 md:border-0 flex flex-col">
                            <div className="p-4 pb-2 text-center">
                                <p className="font-bold">{post.displayName}</p>
                                <p className="text-sm text-gray-500 font-mono">({post.username})</p>
                            </div>
                            <div className="mt-auto p-2 px-4 flex items-center justify-between border-t border-slate-600">
                                <TimeAgo date={post.createdAt} />
                                {auth?.getToken() && auth?.user?.id === post.userId && (
                                    <DeletionButton onClick={() => postMutation.mutate(post.id)} />
                                )}
                            </div>
                        </div>
                        <p className="w-full md:border-l p-5 border-slate-500">{post.content}</p>
                    </div>
                ))}
                <PostCreation threadId={params.id} />
            </div>
        </div>
    )
}

function DeletionButton({ onClick }: { onClick: () => void }) {
    const [consent, setConsent] = useState<boolean>(false);

    useEffect(() => {
        if (consent) {
            const timeout = setTimeout(() => setConsent(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [consent]);

    const handleClick = () => {
        if (!consent) {
            setConsent(true);
            return;
        }
        onClick();
    };

    return (
        <button
            className={`flex items-center justify-center transition-colors ${consent
                ? 'text-red-600 hover:text-red-700'
                : 'text-red-400 hover:text-red-500'
                }`}
            onClick={handleClick}
            title={consent ? "Click again to confirm deletion" : "Delete"}
        >
            {consent ? <Warning size={24} /> : <TrashSimple size={24} />}
        </button>
    );
}

function DeletionWarning({ onClick }: { onClick: () => void }) {
    const [consent, setConsent] = useState<boolean>(false);

    useEffect(() => {
        if (consent) {
            const timeout = setTimeout(() => setConsent(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [consent]);

    const handleClick = () => {
        if (!consent) {
            setConsent(true);
            return;
        }
        onClick();
    };

    return (
        <button
            className={`flex px-2 py-1 my-2 ml-auto rounded-sm items-center justify-center transition-colors ${consent
                ? 'bg-red-600 bg:text-red-700'
                : 'bg-red-400 bg:text-red-500'
                }`}
            onClick={handleClick}
            title={consent ? "Click again to confirm deletion" : "Delete"}
        >
            {consent ? <><Warning size={24} className="mr-2" /> Are you sure you want to delete this thread?</> : <><TrashSimple size={24}  className="mr-2" /> Delete thread</>}
        </button>
    );
}