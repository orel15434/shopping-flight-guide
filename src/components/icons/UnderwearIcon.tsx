
import React, { forwardRef } from 'react';
import { LucideProps } from 'lucide-react';

export const UnderwearIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ color = 'currentColor', size = 24, strokeWidth = 2, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* More detailed underwear shape */}
        <path d="M5 6h14v4c0 0 0 4-7 4s-7-4-7-4V6z" />
        <path d="M5 10h14" />
        <path d="M8 10v2" />
        <path d="M16 10v2" />
      </svg>
    );
  }
);

UnderwearIcon.displayName = 'UnderwearIcon';

export default UnderwearIcon;
