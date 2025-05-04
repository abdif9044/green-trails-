
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useToast as useToastOriginal } from "@/components/ui/use-toast";

export type { Toast, ToastActionElement, ToastProps };
export { toast };
export const useToast = useToastOriginal;
