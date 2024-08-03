import { OrganizationSwitcher, SignOutButton, SignedIn, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"

function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" width={28} height={28} alt="logo" />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1 ">
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer" title="log out">
                <Image src="/assets/logout.svg" width={28} height={28} alt="signout logo" />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4"
            }
          }}
        />
      </div>
    </nav>

  )
}

export default Topbar