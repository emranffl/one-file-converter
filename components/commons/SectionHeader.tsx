import { cn } from "@/lib/utils"
import Skeleton from "react-loading-skeleton"

interface SectionHeaderProps {
  title?: string
  desc?: string
  balance?: boolean
  containerClassName?: string
  titleClassName?: string
  descClassName?: string
  children?: React.ReactNode
  renderAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  isLoading?: boolean
}

export default function SectionHeader({
  title = "Section Title",
  desc,
  balance = false,
  containerClassName,
  titleClassName,
  descClassName,
  children,
  renderAs = "h2",
  isLoading = false,
}: SectionHeaderProps) {
  const Element = renderAs

  return (
    <div className={cn("max-w-2xl space-y-2", containerClassName)}>
      {isLoading ? (
        <Skeleton className={cn("h-8 w-5/6 sm:h-10 md:h-12")} />
      ) : (
        <Element className={cn(titleClassName)}>{title}</Element>
      )}
      {isLoading ? (
        <Skeleton containerClassName="block space-y-1" className="w-2/3" count={3} />
      ) : desc ? (
        <p
          className={cn(
            "whitespace-pre-wrap text-slate-700 dark:text-slate-400 sm:text-xl sm:leading-7",
            balance && "text-balance",
            descClassName
          )}
        >
          {desc}
        </p>
      ) : null}
      {children}
    </div>
  )
}
