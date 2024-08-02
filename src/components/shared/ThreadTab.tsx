import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation';
import React from 'react'
import ThreadCard from '../cards/ThreadCard';

interface Props {
    currentUserId: string,
    accountId: string,
    accountType: string,
}
async function ThreadTab({ currentUserId,
    accountId,
    accountType }: Props) {

    const userThreads = await fetchUserPosts(accountId);
    if (!userThreads) redirect("/")
    return (
        <section className='mt-9 flex flex-col gap-5'>
            {userThreads.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id.toString()}
                    currentUserId={currentUserId}
                    parentId={thread?.parentId}
                    content={thread?.text}
                    author={accountType === "User" ? {
                        name: userThreads.name,
                        id: userThreads.username,
                        image: userThreads.image,
                    } : {
                        name: thread.author.name,
                        id: thread.author.username,
                        image: thread.author.image,

                    }} //todo
                    community={thread?.community} //todo
                    createdAt={thread?.createdAt}
                    comments={thread?.children}
                />
            ))}
        </section>
    )
}

export default ThreadTab