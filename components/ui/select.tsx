"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

/* ------------------------------------------------------------------ */
/* 1. Trigger – Modern glassmorphism with gradients                   */
/* ------------------------------------------------------------------ */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "group relative inline-flex w-full items-center justify-between rounded-2xl border border-slate-200/50 bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm px-4 py-3.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 ease-out placeholder:text-slate-400 hover:from-white hover:to-white hover:shadow-lg hover:shadow-green-500/10 hover:border-green-300/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-400/50 focus:ring-offset-2 focus:ring-offset-white focus:border-green-400 focus:from-white focus:to-green-50/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
    </div>
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-green-500" />
    </SelectPrimitive.Icon>
    
    {/* Subtle glow effect */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-emerald-400/0 to-green-400/0 opacity-0 transition-opacity duration-300 group-hover:from-green-400/5 group-hover:via-emerald-400/10 group-hover:to-green-400/5 group-hover:opacity-100 pointer-events-none" />
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/* ------------------------------------------------------------------ */
/* 2. Scroll buttons with better styling                              */
/* ------------------------------------------------------------------ */
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-2 text-slate-400 hover:text-slate-600 transition-colors",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-2 text-slate-400 hover:text-slate-600 transition-colors",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

/* ------------------------------------------------------------------ */
/* 3. Content – Beautiful floating panel with modern styling         */
/* ------------------------------------------------------------------ */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[12rem] overflow-hidden rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl shadow-slate-900/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "min-w-[var(--radix-select-trigger-width)] w-[var(--radix-select-trigger-width)] translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-white/80 to-emerald-50/50 pointer-events-none" />
      
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn("relative p-2", position === "popper" && "h-full")}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/* ------------------------------------------------------------------ */
/* 4. Label with better styling                                       */
/* ------------------------------------------------------------------ */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/* ------------------------------------------------------------------ */
/* 5. Item – Beautiful interactive items                              */
/* ------------------------------------------------------------------ */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "group relative flex w-full cursor-pointer select-none items-center rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-all duration-150 ease-out hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:scale-[1.02] hover:shadow-sm focus:bg-gradient-to-r focus:from-green-50 focus:to-emerald-50 focus:text-green-700 focus:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-100 data-[state=checked]:to-emerald-100 data-[state=checked]:text-green-800 data-[state=checked]:font-semibold",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-5 w-5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
          <Check className="h-3 w-3" />
        </div>
      </SelectPrimitive.ItemIndicator>
    </span>
    
    <SelectPrimitive.ItemText className="pl-6">
      {children}
    </SelectPrimitive.ItemText>
    
    {/* Hover glow effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400/0 to-emerald-400/0 opacity-0 transition-opacity duration-200 group-hover:from-green-400/10 group-hover:to-emerald-400/10 group-hover:opacity-100 pointer-events-none" />
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/* ------------------------------------------------------------------ */
/* 6. Separator with better styling                                   */
/* ------------------------------------------------------------------ */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "mx-2 my-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent",
      className
    )}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

/* ------------------------------------------------------------------ */
/* 7. Export                                                          */
/* ------------------------------------------------------------------ */
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}