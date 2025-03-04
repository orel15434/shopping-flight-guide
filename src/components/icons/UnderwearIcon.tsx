
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
        <path d="M4 4H20V10H12L10 14L8 10H4Z"/>
        <path d="M8 10H16"/>
      </svg>
    );
  }
);

UnderwearIcon.displayName = 'UnderwearIcon';

export default UnderwearIcon;
