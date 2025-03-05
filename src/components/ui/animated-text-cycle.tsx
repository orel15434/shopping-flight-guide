
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextCycleProps {
  texts: {
    content: string;
    color: string;
  }[];
  className?: string;
  interval?: number;
}

export function AnimatedTextCycle({
  texts,
  className,
  interval = 3000, // Default to 3 seconds per text
}: AnimatedTextCycleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Initial entry animation
    if (initialLoad) {
      setTimeout(() => {
        setInitialLoad(false);
      }, 1500); // Allow enough time for the full entry animation
    }
    
    const timer = setInterval(() => {
      // Start exit animation
      setIsExiting(true);
      
      // Change text after exit animation completes
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsExiting(false);
      }, 1000); // Time for exit animation to complete
      
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval, initialLoad]);

  const currentText = texts[currentIndex].content;
  const charactersArray = currentText.split('');
  
  return (
    <div className={cn("relative overflow-hidden font-sans", className)}>
      <div className="flex justify-center">
        {charactersArray.map((char, i) => (
          <motion.span
            key={`${char}-${i}-${currentIndex}`}
            className={texts[currentIndex].color}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: isExiting ? 0 : 1,
              x: isExiting ? -20 : 0
            }}
            transition={{
              duration: 0.2, // Faster individual letter animation
              // For RTL, stagger from right to left (for both entry and exit)
              delay: (initialLoad || isExiting) 
                ? i * 0.05 // Right to left (0th index is rightmost character in Hebrew)
                : 0,
              ease: "easeInOut"
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
