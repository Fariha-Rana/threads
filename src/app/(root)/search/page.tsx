

import { fetchUserFromDatabase } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
    
  if (!user) return null;

  const userInfo = await fetchUserFromDatabase(user.id)
  console.log(userInfo)
  console.log(userInfo)
  const _userid = userInfo.id
  if (!userInfo?.onboarded) redirect("/onboarding")
  return (
    <section>
      <h1 className="head-text mb-18">
        Search
      </h1>
      
    </section>
  )
}

export default Page

