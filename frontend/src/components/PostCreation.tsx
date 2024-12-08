import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useAuth } from "../AuthContext";
import { NavLink } from "react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function PostCreation({ threadId }: { threadId: string }) {
    const auth = useAuth();
    const [content, setContent] = useState('');

    const queryClient = useQueryClient();

    const addPost = (content: string) => {
        console.log("inside addPost")
        if (!auth?.getToken()) throw new Error('Not authenticated');
        return fetch(`${process.env.REACT_APP_API_URL}/threads/${threadId}/addPost`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.getToken()}`
            },
            body: JSON.stringify({ content })
        }).then(res => {
            if (res.status === 201) {
                return res.json()
            } else {
                throw new Error('Something went wrong');
            }
        })
    }

    const mutation = useMutation({
        mutationFn: addPost,
        mutationKey: ['thread', threadId],
        onMutate: async (newContent) => {
            console.log("inside onmutate")
            if (!auth?.getToken() || !auth.user) throw new Error('Not authenticated');
            await queryClient.cancelQueries({ queryKey: ['thread', threadId] });
            const previousThread = queryClient.getQueryData(['thread', threadId]);
            if (!previousThread) {
                throw new Error('No existing thread data found');
            }
            queryClient.setQueryData(['thread', threadId], (old: any) => {
                if (!old || !old.posts) {
                    return previousThread;
                }
                return {
                    ...old,
                    posts: [...old.posts,
                    {
                        id: `temp-${Date.now()}`,
                        content: newContent,
                        createdAt: new Date().toISOString(),
                        userId: auth?.user?.id,
                        username: auth?.user?.username,
                        displayName: auth?.user?.displayName,
                        registerDate: auth?.user?.registerDate,
                    }
                    ]
                }})
            return { previousThread }
        },
        onSuccess: (data) => {
            console.log("success")
            setContent('');
            queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
        },
        onError: (error, newContent, context: any) => {
            console.error("failed to create post", error)
            queryClient.setQueryData(['thread', threadId], context.previousThread);
        },
        onSettled: () => {
            console.log("settled")
            queryClient.invalidateQueries({ queryKey: ['thread', threadId] });
        }

    })

    function handleSubmit(e: React.FormEvent) {
        console.log("submiting form")
        e.preventDefault();
        if (!content.trim()) return;
        mutation.mutate(content);
    }

    return (
        <form className="bg-slate-700 w-full p-5 flex gap-2 flex-col relative" onSubmit={handleSubmit}>
            {!auth?.getToken() &&
                <div className="absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center backdrop-blur-sm backdrop-contrast-75 gap-5">
                    <p className="text-xl font-medium text-white">
                        Sign in to participate
                    </p>
                    <NavLink to="/login" className="bg-slate-800 hover:bg-blue-900 font-semibold shadow transition-all duration-200 py-3 px-5 w-fit rounded-sm">
                        Log in
                    </NavLink>
                </div>
            }
            <h2 className="text-2xl">Create post</h2>
            <textarea
                className="w-full bg-slate-800 p-2"
                required
                value={content}
                onChange={e => setContent(e.target.value)}
            />
            <button className="flex items-center justify-center gap-2 text-lg bg-blue-600 py-2 rounded w-1/4 self-end" type="submit">
                Post!
                <PaperPlaneTilt size={32} />
            </button>
        </form>
    )
}