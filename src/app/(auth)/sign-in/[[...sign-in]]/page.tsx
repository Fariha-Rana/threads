import { SignIn } from "@clerk/nextjs"

function Page() {
  return (
 <div className="flex justify-center mt-16">
      <SignIn/>
 </div>
  )
}

export default Page