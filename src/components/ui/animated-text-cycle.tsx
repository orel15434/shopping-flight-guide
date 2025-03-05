
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
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      // Start exit animation
      setIsVisible(false);
      
      // Change text after exit animation completes
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
      }, 500); // Time for exit animation to complete
      
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <div className={cn("relative overflow-hidden font-sans", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
          className={cn("flex justify-center", texts[currentIndex].color)}
          dir="rtl"
        >
          {texts[currentIndex].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
