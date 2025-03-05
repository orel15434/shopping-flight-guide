
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    // Initial entry animation
    if (initialLoad) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setInitialLoad(false);
      }, 800);
    }
    
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      // Change text after animation completes
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 800); 
      
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval, initialLoad]);

  const currentText = texts[currentIndex].content;
  // For RTL text, we need to reverse the stagger order (since Hebrew reads right-to-left)
  // First reverse the string to get characters in visual RTL order, then map over them
  const charactersArray = currentText.split('');
  
  return (
    <div className={cn("relative overflow-hidden font-sans", className)}>
      <div className="flex justify-center">
        {charactersArray.map((char, i) => (
          <motion.span
            key={`${char}-${i}-${currentIndex}`}
            className={texts[currentIndex].color}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: isAnimating || initialLoad ? 0 : 1,
              y: isAnimating || initialLoad ? 15 : 0
            }}
            transition={{
              duration: 0.2, // Faster individual letter animation
              // For RTL, we need to stagger from right to left (highest index first)
              delay: (initialLoad || isAnimating) ? (charactersArray.length - 1 - i) * 0.05 : 0,
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
