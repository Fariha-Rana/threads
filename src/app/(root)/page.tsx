import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const { threadsData, isNext } = await fetchThreads(1, 30);
  const user = await currentUser();
  console.log(threadsData);
  return (
    <> <h1 className="head-text text-left">Home</h1>
      <section>
        {threadsData.length === 0 ? (
          <p className="no-result">No Threads Found</p>
        ) : (
          <div>
            {threadsData.map((thread) => (
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
            ))}

          </div>
        )}
      </section>
    </>
  );
}
