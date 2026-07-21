import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" };
export function Button({ className = "", variant = "primary", type = "button", ...props }: Props) {
  return <button type={type} className={`ice-button ${variant === "primary" ? "ice-primary" : variant === "danger" ? "ice-danger" : "ice-secondary"} ${className}`} {...props} />;
}
