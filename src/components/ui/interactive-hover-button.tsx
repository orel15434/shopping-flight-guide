
"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ExternalLink } from "lucide-react";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ className, href, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "group relative px-6 py-3 font-medium text-white transition-colors duration-300 overflow-hidden rounded-lg",
        className
      )}
      ref={ref}
      onClick={() => {
        if (href) {
          window.open(href, "_blank");
        }
      }}
      {...props}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-transform duration-300 group-hover:scale-105"></span>
      <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10"></span>
      <span className="relative flex items-center justify-center gap-2">
        {children || (
          <>
            <ExternalLink size={16} />
            <span>קנה עכשיו</span>
          </>
        )}
      </span>
      <span className="absolute inset-0 border-2 border-white/20 rounded-lg"></span>
      
      {/* Shine effect */}
      <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg" aria-hidden="true">
        <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[500%] h-[300%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45 transition-transform duration-1000 opacity-0 group-hover:opacity-100 group-hover:translate-x-[60%]"></span>
      </span>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
