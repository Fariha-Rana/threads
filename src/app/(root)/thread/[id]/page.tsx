import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadsById } from "@/lib/actions/thread.actions";
import { fetchUserFromDatabase } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({params} : {params : { id : string}}) {
    if(!params.id) return null;
    const user = await currentUser();

    if(!user) return null;

    const userInfo = await fetchUserFromDatabase(user.id);
    if(!userInfo?.onboarded) redirect("/onboarding")

    const thread = await fetchThreadsById(params.id) 
  return (
    <section className="relative">
        <div className="">
        <ThreadCard
                key={thread._id.toString()}
                id={thread._id.toString()}
                currentUserId={user?.id || ""}
                parentId={thread?.parentId}
                content={thread?.text}
                author={thread?.author}
                community={thread?.community}
                createdAt={thread?.createdAt}
                comments={thread?.children}
              />
        </div>
    </section>
  )
}

export default Page