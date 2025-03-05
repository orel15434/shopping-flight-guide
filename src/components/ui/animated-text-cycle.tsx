
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

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      
      // Change text after animation completes - faster animation (800ms instead of 1500ms)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 800); 
      
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  const currentText = texts[currentIndex].content;
  
  return (
    <div className={cn("relative overflow-hidden font-sans", className)}>
      <div className="flex justify-center">
        {currentText.split('').map((char, i) => (
          <motion.span
            key={`${char}-${i}-${currentIndex}`}
            className={texts[currentIndex].color}
            initial={{ opacity: 1 }}
            animate={{
              opacity: isAnimating && i < currentText.length ? 0 : 1,
              y: isAnimating && i < currentText.length ? -15 : 0, // Reduced movement for smoother animation
            }}
            transition={{
              duration: 0.2, // Faster individual letter animation
              delay: isAnimating ? i * 0.05 : 0, // Faster stagger effect (0.05s instead of 0.1s)
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
