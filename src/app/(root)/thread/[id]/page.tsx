import ThreadCard from "@/components/cards/ThreadCard"
import Comments from "@/components/forms/Comments";
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
        <>
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
        </>
        <div className="mt-7">
          <Comments
          threadId={thread.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
           />
        </div>

        <div className="mt-10">
            {thread.children.map((comment : any) => (
              <ThreadCard
              key={comment._id.toString()}
              id={comment._id.toString()}
              currentUserId={user?.id || ""}
              parentId={comment?.parentId}
              content={comment?.text}
              author={comment?.author}
              community={comment?.community}
              createdAt={comment?.createdAt}
              comments={comment?.children}
              isComment={true}
            />
            ))}
        </div>
    </section>
  )
}

export default Page