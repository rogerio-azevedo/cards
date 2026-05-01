'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProgressionStore } from '../../store/progressionStore';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Lock, Play, Star, Sparkles } from 'lucide-react';

const MAP_LEVELS = [
  { id: 1, name: 'Órbita da Terra', x: 20, y: 50, color: 'bg-blue-500' },
  { id: 2, name: 'Cinturão de Asteroides', x: 40, y: 30, color: 'bg-stone-500' },
  { id: 3, name: 'Luas de Júpiter', x: 60, y: 70, color: 'bg-orange-400' },
  { id: 4, name: 'Anéis de Saturno', x: 80, y: 40, color: 'bg-yellow-200' },
  { id: 5, name: 'O Sol', x: 90, y: 15, color: 'bg-yellow-500' },
];

export const WorldMap = () => {
  const router = useRouter();
  const { unlockedLevels } = useProgressionStore();

  const handleLevelClick = (levelId: number) => {
    if (unlockedLevels.includes(levelId)) {
      router.push(`/play?level=${levelId}`);
    }
  };

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 pointer-events-none" />
      
      {/* HUD */}
      <div className="absolute top-8 left-8 z-50">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
          Galáxia de Batalhas
        </h1>
        <p className="text-white/60 mt-2 font-medium">Selecione uma fase para duelar</p>
      </div>

      <div className="w-full max-w-5xl h-[600px] relative mt-16">
        {/* Draw lines between nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {MAP_LEVELS.map((level, idx) => {
            if (idx === MAP_LEVELS.length - 1) return null;
            const next = MAP_LEVELS[idx + 1];
            const isUnlocked = unlockedLevels.includes(next.id);
            return (
              <line
                key={`line-${level.id}`}
                x1={`${level.x}%`}
                y1={`${level.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke={isUnlocked ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'}
                strokeWidth="4"
                strokeDasharray={isUnlocked ? '0' : '8 8'}
              />
            );
          })}
        </svg>

        {/* Draw Nodes */}
        {MAP_LEVELS.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          const isCurrent = Math.max(...unlockedLevels) === level.id;

          return (
            <motion.div
              key={level.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2"
              style={{ left: `${level.x}%`, top: `${level.y}%` }}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
            >
              <div 
                onClick={() => handleLevelClick(level.id)}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl",
                  level.color,
                  isUnlocked ? "hover:ring-4 hover:ring-white/50" : "opacity-40 grayscale cursor-not-allowed",
                  isCurrent && "ring-4 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.8)] animate-pulse"
                )}
              >
                {isUnlocked ? (
                  <Play className="w-8 h-8 text-black/80 ml-1" fill="currentColor" />
                ) : (
                  <Lock className="w-8 h-8 text-white/50" />
                )}
              </div>
              <div className="bg-black/80 px-3 py-1 rounded-md border border-white/10 text-white font-bold text-sm text-center shadow-lg backdrop-blur-sm">
                <span className="text-white/50 text-xs block mb-0.5">Fase {level.id}</span>
                {level.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
