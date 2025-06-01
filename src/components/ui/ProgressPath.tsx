import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

type ProgressPathProps = {
  progress: number;
  theme: 'fantasy' | 'sci-fi' | 'adventure' | 'mystery';
  className?: string;
};

export function ProgressPath({ progress, theme, className }: ProgressPathProps) {
  // Define theme-specific colors
  const themeColors = {
    fantasy: {
      path: 'from-purple-900 to-purple-700',
      milestone: 'bg-yellow-400',
      track: 'bg-purple-100',
      particle: 'bg-purple-300'
    },
    'sci-fi': {
      path: 'from-cyan-600 to-blue-500',
      milestone: 'bg-green-400',
      track: 'bg-cyan-100',
      particle: 'bg-cyan-300'
    },
    adventure: {
      path: 'from-amber-600 to-amber-400',
      milestone: 'bg-emerald-500',
      track: 'bg-amber-100',
      particle: 'bg-amber-300'
    },
    mystery: {
      path: 'from-slate-800 to-slate-600',
      milestone: 'bg-purple-400',
      track: 'bg-slate-200',
      particle: 'bg-slate-400'
    }
  };

  const colors = themeColors[theme];

  // Create milestones at specific percentages
  const milestones = [0, 25, 50, 75, 100].map((milestone) => ({
    position: milestone,
    reached: progress >= milestone,
  }));

  // Generate path curves based on theme
  const getPathD = (theme: string) => {
    switch (theme) {
      case 'fantasy':
        return 'M10,50 Q30,30 50,50 T90,50';
      case 'sci-fi':
        return 'M10,50 L30,30 L50,70 L70,30 L90,50';
      case 'adventure':
        return 'M10,50 Q25,70 50,30 T90,50';
      case 'mystery':
        return 'M10,50 C20,10 40,90 60,30 S80,70 90,50';
      default:
        return 'M10,50 Q50,10 90,50';
    }
  };

  return (
    <div className={cn('relative w-full h-40 px-4', className)}>
      {/* Track */}
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d={getPathD(theme)}
          fill="none"
          stroke={`url(#${theme}-track-gradient)`}
          strokeWidth="6"
          strokeLinecap="round"
          className={colors.track}
        />
        
        {/* Progress path */}
        <path
          d={getPathD(theme)}
          fill="none"
          stroke={`url(#${theme}-progress-gradient)`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - progress}
          className="transition-all duration-1000 ease-in-out"
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id={`${theme}-progress-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={`stop-${colors.path.split(' ')[0]}`} />
            <stop offset="100%" className={`stop-${colors.path.split(' ')[1]}`} />
          </linearGradient>
          <linearGradient id={`${theme}-track-gradient`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={colors.track} stopOpacity="0.6" />
            <stop offset="100%" className={colors.track} stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Milestones */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {milestones.map((milestone, index) => {
          const position = 10 + (milestone.position * 0.8);
          return (
            <motion.div
              key={index}
              className={cn(
                'absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2',
                milestone.reached ? colors.milestone : 'bg-gray-300'
              )}
              style={{
                left: `${position}%`,
                top: '50%',
              }}
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{
                scale: milestone.reached ? [0.8, 1.2, 1] : 0.8,
                opacity: milestone.reached ? 1 : 0.6,
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
            />
          );
        })}
      </div>
      
      {/* Animated particles */}
      {progress > 5 && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => {
            const particleProgress = Math.min(progress, 100);
            const delay = i * 1.5;
            const position = 10 + (particleProgress * 0.8);
            
            return (
              <motion.div
                key={i}
                className={cn(
                  'absolute w-2 h-2 rounded-full opacity-70',
                  colors.particle
                )}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{
                  x: `${position}%`,
                  y: ['0%', '-100%', '0%', '100%', '0%'],
                  opacity: [0, 0.8, 0.8, 0.8, 0],
                }}
                transition={{
                  duration: 4,
                  delay: delay,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
                style={{ top: '50%' }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}