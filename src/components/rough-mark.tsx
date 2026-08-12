type RoughMarkProps = {
  variant: "underline" | "arrow" | "circle";
  className?: string;
};

const paths = {
  underline: "M2 11.5 C22 7.5, 48 14, 72 9.5 S112 8.5, 126 11",
  arrow: "M3 18 C25 15, 48 10, 75 5 M64 2 L76 5 L68 14",
  circle: "M63 3 C91 2, 121 13, 124 34 C127 55, 96 66, 61 64 C27 63, 3 52, 3 34 C3 14, 31 4, 63 3 Z",
} as const;

export function RoughMark({ variant, className }: RoughMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      focusable="false"
      viewBox={variant === "circle" ? "0 0 128 68" : "0 0 128 22"}
    >
      <path d={paths[variant]} fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
