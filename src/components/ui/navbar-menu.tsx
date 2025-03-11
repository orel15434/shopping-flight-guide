
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        className={cn(
          "cursor-pointer text-black hover:opacity-[0.9] dark:text-white",
          active === item ? "opacity-100" : "opacity-70"
        )}
      >
        {item}
      </motion.p>
      {active === item && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 mt-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 min-w-[200px]"
        >
          <div className="p-4">{children}</div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex justify-center space-x-8 px-4"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <div className="flex space-x-2">
      <div className="w-16 h-16 relative overflow-hidden rounded-lg">
        <img 
          src={src} 
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-sm text-black dark:text-white hover:underline"
        >
          {title}
        </a>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};

export const HoveredLink = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <a
      href={href}
      className={cn(
        "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white",
        className
      )}
    >
      {children}
    </a>
  );
};
