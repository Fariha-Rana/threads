import PostThread from "@/components/forms/PostThread";
import { fetchUserFromDatabase } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
    const user = await currentUser();
    if (!user) return null;
    
    const userInfo = await fetchUserFromDatabase(user.id)
    const _userid = userInfo._id

    if (!userInfo?.onboarded) redirect("/onboarding")

    return (
        <>
            <h1 className='head-text'>Create Thread</h1>
            <PostThread userId={_userid.toString()}/>
        </>
    )
}

export default Page