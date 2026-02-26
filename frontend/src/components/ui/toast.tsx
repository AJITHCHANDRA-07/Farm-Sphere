import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import * as React from "react";

const toastVariants = cva("toast", {
  variants: {
    variant: {
      default: "bg-white text-black",
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type ToastProps = React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>;
export type ToastActionElement = React.ReactElement;

export const Toast = ToastPrimitive.Root;
export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;
export const ToastClose = ToastPrimitive.Close;
export const ToastViewport = ToastPrimitive.Viewport;
export const ToastProvider = ToastPrimitive.Provider;
