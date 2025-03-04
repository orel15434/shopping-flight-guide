
import React from 'react';
import { LucideProps } from 'lucide-react';

export const UnderwearIcon: React.FC<LucideProps> = ({
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14 104h382v47h-15v17h-46l-86 242.88L163 168H116v-17h-15v-47h-87z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M116 151v17h47l86 242.88L335 168h46v-17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UnderwearIcon;
