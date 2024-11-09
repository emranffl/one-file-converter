import { LINKS } from "@/configs/router.config"
import { cn } from "@/lib/utils"
import { Github } from "lucide-react"
import Link from "next/link"
import { Logo } from "./Logo.Client"
import { ThemeToggler } from "./ThemeToggler.Client"
import { buttonVariants } from "./ui/button"

const Navbar = () => {
  return (
    <>
      <nav className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <div className="flex items-center space-x-4">
            <Logo />
          </div>
          <div className="ml-auto flex items-center space-x-2">
            {/* <Link
              href="/image-converter"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: "hidden sm:inline-flex",
                })
              )}
            >
              Get Started
            </Link> */}
            <Link
              href={LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })
              )}
            >
              <Github className="size-5" />
            </Link>
            <ThemeToggler />
          </div>
        </div>
      </nav>
    </>
  )
}

export { Navbar }
