import { Avatar as PrimitiveAvatar } from "radix-ui";
import clsx from "clsx";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface Props {
  src: string;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: "w-8 h-8",
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
  "2xl": "w-48 h-48",
} as const;

const textSizeClasses: Record<AvatarSize, string> = {
  xs: "text-sm",
  sm: "text-md",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-3xl",
  "2xl": "text-6xl",
} as const;

export function Avatar({ src, name, size = "sm", className }: Props) {
  return (
    <PrimitiveAvatar.Root
      className={clsx(
        sizeClasses[size],
        "rounded-full",
        "overflow-hidden",
        "inline-flex",
        "items-center",
        "justify-center",
        className
      )}
    >
      <PrimitiveAvatar.Image
        className="border-inherit w-full h-full object-cover"
        src={src}
        alt={`${name}'s Avatar`}
      />
      <PrimitiveAvatar.Fallback
        className={clsx(
          "flex",
          "justify-center",
          "items-center",
          "border-inherit",
          "w-full",
          "h-full",
          "text-black",
          "bg-neutral-200",
          "font-extrabold",
          textSizeClasses[size]
        )}
      >
        {name
          .trim()
          .split(/\s+/)
          .map((word) => (word !== "" ? word[0].toUpperCase() : ""))
          .join("")
          .slice(0, 2)}
      </PrimitiveAvatar.Fallback>
    </PrimitiveAvatar.Root>
  );
}
