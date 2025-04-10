import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { LowPolySphere } from '../icons/ReEnvisionLogo';

interface AuthPageProps {
  login?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface Polygon {
  points: string;
  opacity: number;
  color: string;
}

const NetworkNode: React.FC<{ x: number; y: number; delay: number }> = ({ x, y, delay }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-blue-400/30"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1, 1, 0],
      opacity: [0, 0.8, 0.8, 0]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);

const NetworkLine: React.FC<{ x1: number; y1: number; x2: number; y2: number; delay: number }> = ({ x1, y1, x2, y2, delay }) => (
  <motion.div
    className="absolute bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 h-[1px]"
    style={{
      left: `${Math.min(x1, x2)}%`,
      top: `${y1}%`,
      width: `${Math.abs(x2 - x1)}%`,
      transform: `rotate(${Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI)}deg)`,
      transformOrigin: 'left center'
    }}
    initial={{ scaleX: 0, opacity: 0 }}
    animate={{
      scaleX: [0, 1, 1, 0],
      opacity: [0, 0.5, 0.5, 0]
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);


export const AuthPage: React.FC<AuthPageProps> = ({login = true}: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(login);

  // Generate stars
  const stars = React.useMemo(() => {
    const result: Star[] = [];
    for (let i = 0; i < 50; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
    return result;
  }, []);

  // Generate polygons for low-poly background
  const polygons = React.useMemo(() => {
    const result: Polygon[] = [];
    for (let i = 0; i < 15; i++) {
      const points = Array(3).fill(0).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100
      })).map(p => `${p.x},${p.y}`).join(' ');

      result.push({
        points,
        opacity: Math.random() * 0.1 + 0.05,
        color: Math.random() > 0.5 ? '#1a365d' : '#1e3a8a'
      });
    }
    return result;
  }, []);

  const nodes = React.useMemo(() => {
    const result = [];
    for (let i = 0; i < 15; i++) {
      result.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      });
    }
    return result;
  }, []);

  const lines = React.useMemo(() => {
    const result = [];
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
    <div className="absolute inset-0 flex items-center justify-center p-4 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #000000, #050b16)'
      }}>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity * 1.5
            }}
            animate={{
              opacity: [star.opacity, star.opacity * 1.5, star.opacity],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Low-poly background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {polygons.map((poly, i) => (
          <polygon
            key={i}
            points={poly.points}
            fill={poly.color}
            opacity={poly.opacity}
          />
        ))}
      </svg>
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        {nodes.map((node, i) => (
          <NetworkNode key={`node-${i}`} {...node} />
        ))}
        {lines.map((line, i) => (
          <NetworkLine key={`line-${i}`} {...line} />
        ))}
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-2">
            <Canvas camera={{ position: [0, 0, 6] }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />
              <pointLight position={[0, 0, 5]} intensity={0.4} color="#ffffff" />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
              <LowPolySphere />
            </Canvas>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to ReEnvision AI</h1>
          <p className="text-blue-200">Experience the future of intelligent computing</p>
        </div>
        {/* Pass isLogin and setIsLogin to the forms */}
        {isLogin ? <LoginForm isLogin={isLogin} setIsLogin={setIsLogin} /> : <SignUpForm isLogin={isLogin} setIsLogin={setIsLogin} />}
        {/* Removed the toggle link paragraph from here */}
      </div>
    </div>
  );
};
