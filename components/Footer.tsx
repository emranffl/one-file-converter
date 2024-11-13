import { LINKS } from "@/configs/router.config"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t bg-slate-50 px-4 py-6 text-foreground dark:bg-background sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col items-center justify-between sm:flex-row">
        <div className="flex flex-col space-y-2 text-center sm:flex-row sm:space-x-4 sm:space-y-0 sm:text-left">
          <Link href={LINKS.PRIVACY_POLICY.home} className="hover:text-muted-foreground">
            Privacy Policy
          </Link>
          <Link href={LINKS.TERMS_AND_CONDITIONS.home} className="hover:text-muted-foreground">
            Terms & Conditions
          </Link>
        </div>
        <p className="mt-4 text-sm text-foreground sm:mt-0">
          &copy; {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
