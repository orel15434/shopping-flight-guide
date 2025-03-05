
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
      
      // Change text after animation completes
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsAnimating(false);
      }, 1500); // Animation takes about 1.5 seconds to complete
      
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
              y: isAnimating && i < currentText.length ? -20 : 0,
            }}
            transition={{
              duration: 0.3,
              delay: isAnimating ? i * 0.1 : 0, // Stagger effect from right to left (RTL)
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
