import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation';
import React from 'react'
import ThreadCard from '../cards/ThreadCard';
import { fetchCommunityPosts } from '@/lib/actions/community.actions';

interface Props {
    currentUserId: string,
    accountId: string,
    accountType: string,
}
async function ThreadTab({ currentUserId,
    accountId,
    accountType }: Props) {
        let result : any;

        if(accountType === "Community"){
            result = await fetchCommunityPosts(accountId);
        }
        if(accountType === "User"){
            result = await fetchUserPosts(accountId);
        }
        
        console.log(result)
    if (!result) redirect("/")
    return (
        <section className='mt-9 flex flex-col gap-5'>
            {result.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id.toString()}
                    currentUserId={currentUserId}
                    parentId={thread?.parentId}
                    content={thread?.text}
                    author={accountType === "User" ? {
                        name: result.name,
                        id: result.username,
                        image: result.image,
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