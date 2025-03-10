
import * as React from "react";
import { motion, MotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useIsMobile, useIsVerySmallScreen, useIsExtraSmallScreen } from "@/hooks/use-mobile";

interface CategoryItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface AnimatedCategoryBarProps {
  items: CategoryItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  className?: string;
}

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 0.8,
    scale: 1.5,
    transition: {
      opacity: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.4, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 0.6,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

export const AnimatedCategoryBar = React.forwardRef<HTMLDivElement, AnimatedCategoryBarProps>(
  ({ className, items, activeItem, onItemClick }, ref) => {
    const isMobile = useIsMobile();
    const isVerySmallScreen = useIsVerySmallScreen();
    const isExtraSmallScreen = useIsExtraSmallScreen();
    
    const getGradient = (id: string) => {
      switch(id) {
        case 'clothing':
          return 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)';
        case 'shoes':
          return 'radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0) 70%)';
        case 'electronics':
          return 'radial-gradient(circle, rgba(14,165,233,0.4) 0%, rgba(14,165,233,0) 70%)';
        case 'other':
          return 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(139,92,246,0) 70%)';
        default:
          return 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(59,130,246,0) 70%)';
      }
    };

    const getIconColor = (id: string) => {
      switch(id) {
        case 'clothing':
          return 'text-pink-500';
        case 'shoes':
          return 'text-orange-500';
        case 'electronics':
          return 'text-sky-500';
        case 'other':
          return 'text-violet-500';
        default:
          return 'text-blue-500';
      }
    };

    const motionProps: MotionProps = {
      initial: "initial",
      whileHover: "hover"
    };

    return (
      <motion.nav
        ref={ref}
        className={cn(
          "p-2 rounded-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-lg border border-border/40 shadow-lg relative overflow-hidden w-full max-w-full",
          isMobile && "p-1.5", 
          isVerySmallScreen && "p-1", 
          isExtraSmallScreen && "p-0.5",
          className,
        )}
        initial="initial"
        whileHover="hover"
      >
        <motion.div
          className="absolute -inset-2 bg-gradient-radial from-transparent via-blue-400/20 via-30% via-purple-400/20 via-60% via-red-400/20 via-90% to-transparent rounded-3xl z-0 pointer-events-none"
          variants={navGlowVariants}
        />
        <ul className={cn(
          "flex items-center relative z-10 flex-wrap justify-center", 
          isMobile ? "gap-1" : "gap-2",
          isVerySmallScreen && "gap-0.5", 
          isExtraSmallScreen && "gap-0.5" 
        )}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;
            const iconColor = getIconColor(item.id);
            const gradient = getGradient(item.id);

            // Show only icons for non-active items on small screens
            const showTextOnMobile = !isVerySmallScreen || isActive;
            // On extra small screens, show only the active item's text
            const showText = !isExtraSmallScreen || isActive;

            return (
              <motion.li key={item.id} className="relative mb-1">
                <button
                  onClick={() => onItemClick(item.id)}
                  className="block w-full"
                >
                  <motion.div
                    className="block rounded-xl overflow-visible group relative"
                    style={{ perspective: "600px" }}
                    whileHover="hover"
                    initial="initial"
                  >
                    <motion.div
                      className="absolute inset-0 z-0 pointer-events-none"
                      variants={glowVariants}
                      animate={isActive ? "hover" : "initial"}
                      style={{
                        background: gradient,
                        opacity: isActive ? 0.6 : 0,
                        borderRadius: "16px",
                      }}
                    />
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent transition-colors rounded-xl",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                        isMobile && "px-2 py-1.5 text-sm gap-1.5", 
                        isVerySmallScreen && "px-1.5 py-1 text-xs gap-1", 
                        isExtraSmallScreen && "px-1 py-0.5 text-[10px] gap-0.5 min-w-[40px]" 
                      )}
                      variants={itemVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center bottom",
                      }}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? iconColor : "text-foreground",
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5", 
                          isMobile && "h-4 w-4",
                          isVerySmallScreen && "h-3.5 w-3.5",
                          isExtraSmallScreen && "h-3 w-3"
                        )} />
                      </span>
                      {(showText && showTextOnMobile) && <span>{item.name}</span>}
                    </motion.div>
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent transition-colors rounded-xl",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                        isMobile && "px-2 py-1.5 text-sm gap-1.5", 
                        isVerySmallScreen && "px-1.5 py-1 text-xs gap-1", 
                        isExtraSmallScreen && "px-1 py-0.5 text-[10px] gap-0.5 min-w-[40px]" 
                      )}
                      variants={backVariants}
                      transition={sharedTransition}
                      style={{
                        transformStyle: "preserve-3d",
                        transformOrigin: "center top",
                        rotateX: 90,
                      }}
                    >
                      <span
                        className={cn(
                          "transition-colors duration-300",
                          isActive ? iconColor : "text-foreground",
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5", 
                          isMobile && "h-4 w-4",
                          isVerySmallScreen && "h-3.5 w-3.5",
                          isExtraSmallScreen && "h-3 w-3"
                        )} />
                      </span>
                      {(showText && showTextOnMobile) && <span>{item.name}</span>}
                    </motion.div>
                  </motion.div>
                </button>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
    );
  }
);

AnimatedCategoryBar.displayName = "AnimatedCategoryBar";
