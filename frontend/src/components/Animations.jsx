import { motion } from 'framer-motion';

export const FadeIn = ({ children, delay = 0, direction = 'up', distance = 20, duration = 0.6, className = "" }) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {}
  };

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ 
        duration: duration, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ children, staggerDelay = 0.1, delayChildren = 0 }) => {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: false }}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};
