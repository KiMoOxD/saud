import * as React from "react"

const Button = React.forwardRef(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"

  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
      case "secondary":
        return "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      case "ghost":
        return "hover:bg-accent hover:text-accent-foreground"
      case "link":
        return "text-primary underline-offset-4 hover:underline"
      default:
        return "bg-primary text-primary-foreground hover:bg-primary/90"
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-9 rounded-md px-3"
      case "lg":
        return "h-11 rounded-md px-8"
      case "icon":
        return "h-10 w-10 rounded-md"
      default:
        return "h-10 rounded-md px-4 py-2"
    }
  }

  return (
    <Comp
      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
