import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/core/lib/utils"

const cardVariants = cva(
  "group/card flex flex-col overflow-hidden rounded-card border",
  {
    variants: {
      variant: {
        default: "border-border bg-surface-elevated text-foreground shadow-card",
        muted: "border-border bg-surface-muted text-foreground",
        dark: "border-surface-dark-faint bg-surface-dark-elevated text-surface-dark-foreground shadow-panel",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Card({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="card"
      data-variant={variant}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-4 p-6", className)} {...props} />
}

function CardTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp data-slot="card-title" className={cn("font-display text-h3 font-bold", className)} {...props} />
  )
}

function CardDescription({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="card-description"
      className={cn(
        "text-body-sm text-muted-foreground group-data-[variant=dark]/card:text-surface-dark-muted",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("self-start", className)} {...props} />
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-6 pb-6", className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex items-center gap-3 px-6 pb-6", className)} {...props} />
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
