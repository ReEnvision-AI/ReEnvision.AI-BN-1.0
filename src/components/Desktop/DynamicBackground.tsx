import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

interface NetworkNode {
  x: number;
  y: number;
  delay: number;
}

interface NetworkLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay: number;
}

interface DynamicBackgroundProps {
  style?: string;
}

export const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ style }) => {
  // Generate stars
  const stars = useMemo(() => {
    const result: Star[] = [];
    for (let i = 0; i < 50; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        delay: Math.random() * 2
      });
    }
    return result;
  }, []);

  // Generate network nodes
  const nodes = useMemo(() => {
    const result: NetworkNode[] = [];
    for (let i = 0; i < 15; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      });
    }
    return result;
  }, []);

  // Generate network lines
  const lines = useMemo(() => {
    const result: NetworkLine[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) continue;
        result.push({
          x1: nodes[i].x,
          y1: nodes[i].y,
          x2: nodes[j].x,
          y2: nodes[j].y,
          delay: Math.max(nodes[i].delay, nodes[j].delay)
        });
      }
    }
    return result;
  }, [nodes]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{ background: style }}
    >
      {/* Stars Layer */}
      <div className="absolute inset-0">
        <AnimatePresence>
          {stars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size
              }}
              animate={{
                opacity: [star.opacity, star.opacity * 1.5, star.opacity],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: star.delay,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Network Layer */}
      <div className="absolute inset-0">
        {/* Network Lines */}
        {lines.map((line, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 h-[1px]"
            style={{
              left: `${Math.min(line.x1, line.x2)}%`,
              top: `${line.y1}%`,
              width: `${Math.abs(line.x2 - line.x1)}%`,
              transform: `rotate(${Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * (180 / Math.PI)}deg)`,
              transformOrigin: 'left center'
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: [0, 1, 1, 0],
              opacity: [0, 0.5, 0.5, 0]
            }}
            transition={{
              duration: 4,
              delay: line.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Network Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute w-2 h-2 rounded-full bg-blue-400/30"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1, 0],
              opacity: [0, 0.8, 0.8, 0]
            }}
            transition={{
              duration: 4,
              delay: node.delay,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};
