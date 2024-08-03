

import UserCard from "@/components/cards/UserCard";
import { fetchUserFromDatabase, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUserFromDatabase(user.id)
  const _userid = userInfo.id
  if (!userInfo?.onboarded) redirect("/onboarding");

  const queryUsers = await fetchUsers(
    {
      userId: _userid,
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
            queryUsers.users.length === 0 ? (
              <p className="no-result">no users Found</p>
            ) : (
             <>
              {queryUsers.users.map((user) => (
                  <UserCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  username={user.username}
                  imageUrl={user.image}
                  userType='User'
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

