"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sheet(props: React.ComponentProps<typeof Dialog.Root>) {
  return <Dialog.Root {...props} />
}

export function SheetTrigger(
  props: React.ComponentProps<typeof Dialog.Trigger>
) {
  return <Dialog.Trigger {...props} />
}

export function SheetClose(
  props: React.ComponentProps<typeof Dialog.Close>
) {
  return <Dialog.Close {...props} />
}

export function SheetPortal(
  props: React.ComponentProps<typeof Dialog.Portal>
) {
  return <Dialog.Portal {...props} />
}

export function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      className={cn(
        "fixed inset-0 bg-black/50 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
      {...props}
    />
  )
}

export function SheetContent({
  side = "left",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  side?: "left" | "right" | "top" | "bottom"
}) {
  return (
    <Dialog.Portal>
      <SheetOverlay />

      <Dialog.Content
        className={cn(
          "fixed z-50 bg-[#0f1116] text-white shadow-xl flex flex-col p-4",
          side === "left" &&
            "top-0 left-0 h-full w-64 data-[state=open]:slide-in-from-left",
          side === "right" &&
            "top-0 right-0 h-full w-64 data-[state=open]:slide-in-from-right",
          className
        )}
        {...props}
      >
        {/* REQUIRED for accessibility */}
        <Dialog.Title className="sr-only">Menu</Dialog.Title>
        <Dialog.Description className="sr-only">
          Slide-in menu sidebar
        </Dialog.Description>

        {children}

        <Dialog.Close className="absolute top-4 right-4">
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
