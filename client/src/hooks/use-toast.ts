import { toast as sonnerToast } from "sonner"

export const useToast = () => {
  return {
    toast: (options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
      sonnerToast(options.title, {
        description: options.description,
        className:
          options.variant === "destructive"
            ? "bg-red-500 text-white"
            : "bg-gray-800 text-white",
      })
    },
  }
}
