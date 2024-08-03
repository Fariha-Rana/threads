import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUserFromDatabase, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function Page() {
  const user : any = await currentUser()
  const userInfo = await fetchUserFromDatabase(user.id)

  if(!userInfo) return null;

  if(userInfo.onboarded) redirect("/")
  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user?.username,
    name: userInfo?.name || user?.firstName,
    bio: userInfo?.bio,
    image: userInfo?.image || user?.imageurl
  }

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20' >
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>Complete Your profile now to use Threads.</p>
      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle="Continue...." />
      </section>
    </main>
  )
}

export default Page