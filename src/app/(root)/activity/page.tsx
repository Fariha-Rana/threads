import {
  fetchUserActivity,
  fetchUserFromDatabase,
} from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUserFromDatabase(user.id);
  const _userid = userInfo._id;
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await fetchUserActivity(_userid);

  return (
    <section>
      <h1 className="head-text mb-18">Activity</h1>
      {activity.length > 0 ? (
        <>
          {activity.map((act) => (
            <Link key={act._id} href={`/thread/${act.parentId}`}>
              <article className="activity-card mt-4">
                <div className="relative h-10 w-10 ">
                  <Image
                    src={act.author.image}
                    alt={"profile image"}
                    fill
                    className="cursor-pointer  rounded-full"
                  />
                </div>
                <p className="!text-small-regular text-light-1">
                  <span className="mr-1 text-primary-500" >@{act.author.name} </span> {" "} replied to your thread
                </p>
              </article>
            </Link>
          ))}
        </>
      ) : (
        <p className="no-result">No Activity Found</p>
      )}
    </section>
  );
}

export default Page;
