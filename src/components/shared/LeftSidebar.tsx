"use client"
import { sidebarLinks } from "@/constant/index"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs"

function LeftSidebar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-6 px-6'>
        {sidebarLinks.map((link) => {
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

          if (link.route === "/profile") link.route = `${link.route}/${userId}`
          return (
            <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive && "bg-primary-500"}`}>
              <Image src={link.imgURL} width={24} height={24} alt={link.label} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton redirectUrl={"/sign-in"}>
            <div className="flex cursor-pointer gap-4 p-4 " title="log out">
              <Image src="/assets/logout.svg" width={24} height={24} alt="signout logo" />
              <span className=" text-light-2 max-lg:hidden">Log Out</span>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar