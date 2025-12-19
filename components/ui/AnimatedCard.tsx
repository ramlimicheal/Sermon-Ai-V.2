import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  hover?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  onClick,
  hover = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={hover ? { 
        y: -2, 
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className = '',
  staggerDelay = 0.05,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.25,
                ease: [0.25, 0.1, 0.25, 1]
              }
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) => {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface PulseProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

export const Pulse: React.FC<PulseProps> = ({
  children,
  className = '',
  active = true,
}) => {
  return (
    <motion.div
      animate={active ? {
        scale: [1, 1.02, 1],
        opacity: [1, 0.8, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScaleOnHoverProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

export const ScaleOnHover: React.FC<ScaleOnHoverProps> = ({
  children,
  className = '',
  scale = 1.02,
}) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className = '',
  direction = 'left',
  delay = 0,
}) => {
  const variants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    top: { y: -100, opacity: 0 },
    bottom: { y: 100, opacity: 0 },
  };

  return (
    <motion.div
      initial={variants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.4, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SuccessCheckmarkProps {
  size?: number;
  className?: string;
}

export const SuccessCheckmark: React.FC<SuccessCheckmarkProps> = ({
  size = 24,
  className = '',
}) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial="hidden"
      animate="visible"
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { 
            pathLength: 1, 
            opacity: 1,
            transition: { duration: 0.4, ease: 'easeOut' }
          },
        }}
      />
      <motion.path
        d="M8 12l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: { 
            pathLength: 1, 
            opacity: 1,
            transition: { duration: 0.3, delay: 0.3, ease: 'easeOut' }
          },
        }}
      />
    </motion.svg>
  );
};

interface LoadingDotsProps {
  className?: string;
  size?: number;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className = '',
  size = 8,
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="bg-current rounded-full"
          style={{ width: size, height: size }}
          animate={{
            y: [0, -6, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

interface CountUpProps {
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 1.5,
  className = '',
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};
