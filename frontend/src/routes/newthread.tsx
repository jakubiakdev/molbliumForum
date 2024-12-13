import { useEffect, useState } from "react";
import PostCreation from "../components/PostCreation";
import ProtectedRoute from "../components/ProtectedRoute";
import fetchData from "../util/fetchData";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useAuth } from "../AuthContext";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNotice } from "../NoticeContext";
import { useNavigate } from "react-router";

interface Tag {
    id: string;
    name: string;
    color: string;
}

export default function NewThread() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [tag, setTag] = useState('');


    const notice = useNotice();
    const auth = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const addThread = ({title, content, tag}: {title: string, content: string, tag: string}) => {
        if (!auth?.getToken()) throw new Error('Not authenticated');
        return fetch(`${process.env.REACT_APP_API_URL}/threads/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.getToken()}`
            },
            body: JSON.stringify({ title, content, tag })
        }).then(res => {
            if (res.status === 201) {
                return res.json()
            } else {
                throw new Error('Something went wrong');
            }
        })
    }


    const mutation = useMutation({
        mutationFn: addThread,
        mutationKey: ['allThreads'],
        onSuccess: (data, variables, context) => {
            notice.setMessage('Your Thread was created successfully!', 'success', 10000);
            queryClient.invalidateQueries({ queryKey: 'allThreads'});
            navigate(`/thread/${data.id}`);
        },
    })

    function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        if (!content.trim() || !title.trim()) return
        mutation.mutate({ title, content, tag });
    }

    useEffect(() => {
        // not using react-query as tags would be changed very infrequently by an admin 
        // If someone wanted to use a newly created tag they should refresh the website anyway
        // TODO: maybe it's not as bad as I thought, might want to verify
        fetchData.tags().then(data => {
            setAvailableTags(data);
        })
    }, []);


    return (
        <ProtectedRoute>
            <form className="lg:w-5/6 mx-auto py-6 flex gap-6 flex-col" onSubmit={handleRegister}>
                <h1 className="text-3xl">New thread</h1>
                <div className='border rounded border-slate-500 p-5'>
                    <div className="flex gap-2">
                        <label className="w-4/5">Title
                            <input
                                type="text"
                                className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                            />
                        </label>
                        <label>Tag <span className="text-gray-400">(optional)</span>
                            <select
                                className="w-full bg-slate-800 p-2 my-2 rounded-sm border-transparent border" //transparent border to match input's height
                                value={tag}
                                onChange={e => setTag(e.target.value)}
                                style={{ background: availableTags.find((t: any) => t.id == tag)?.color }}>
                                <option value="">Select a tag</option>
                                {availableTags.map((tag: any) => (
                                    <option key={tag.id} value={tag.id}>{tag.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <label>Message
                        <textarea
                            className="w-full bg-slate-800 p-2 my-2 rounded-sm"
                            required
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </label>
                    <button className="flex items-center justify-center gap-2 text-lg bg-blue-600 py-2 rounded w-1/4 ml-auto my-4" type="submit">
                        Create thread
                        <PaperPlaneTilt size={32} />
                    </button>
                </div>
            </form>
        </ProtectedRoute>
    )
}