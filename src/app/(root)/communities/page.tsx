

import CommunityCard from "@/components/cards/CommunityCard";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUserFromDatabase, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUserFromDatabase(user.id)
  const _userid = userInfo.id
  if (!userInfo?.onboarded) redirect("/onboarding");

  const queryUsers = await fetchCommunities(
    {
      searchString: "",
      pageNumber: 1,
      pageSize: 20,
      sortBy: "desc"
    }
  )
  return (
    <section>
      <h1 className="head-text mb-18">Search
          </h1>
        <div className="mt-14 flex flex-col gap-9">
          {
            queryUsers.communities.length === 0 ? (
              <p className="no-result">no communities Found</p>
            ) : (
             <>
              {queryUsers.communities.map((community) => (
                  <CommunityCard
                  key={community.id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={community.members}
                  />
              )) }
             </>
            )
          }
          </div>

    </section>
  )
}

export default Page

