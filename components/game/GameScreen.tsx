'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { generateBasicDeck, cardCatalog } from '../../data/cards';
import { GameBoard } from './GameBoard';
import { Hand } from './Hand';

import { useRouter, useSearchParams } from 'next/navigation';
import { useProgressionStore } from '../../store/progressionStore';

export const GameScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = Number(searchParams.get('level')) || 1;
  const { unlockLevel } = useProgressionStore();

  const { startGame, playerHand, opponentHand, currentTurn, phase } = useGameStore();

  useEffect(() => {
    useGameStore.getState().startGame(generateBasicDeck(), generateBasicDeck());
  }, []);

  // Simple AI Turn Logic
  useEffect(() => {
    if (currentTurn === 'Opponent' && phase === 'Anomaly') {
      const runAi = async () => {
        const store = useGameStore.getState();
        
        await new Promise(r => setTimeout(r, 1000));
        store.nextPhase();
        
        await new Promise(r => setTimeout(r, 1000));
        const opponentHand = useGameStore.getState().opponentHand;
        const playableCard = opponentHand.find(c => {
          const cat = cardCatalog.find(cat => cat.id === c.cardId);
          return cat?.type === 'Moon' || cat?.type === 'DwarfPlanet';
        });

        if (playableCard) {
          const cat = cardCatalog.find(cat => cat.id === playableCard.cardId);
          if (cat) {
            const oppField = useGameStore.getState().opponentField;
            const emptySlots = cat.allowedSlots.filter(s => !oppField.attack[s] && !oppField.defense[s]);
            if (emptySlots.length > 0) {
              const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
              const mode = Math.random() > 0.5 ? 'Attack' : 'Defense';
              store.playCardToField('Opponent', playableCard.instanceId, randomSlot, mode);
            }
          }
        }

        await new Promise(r => setTimeout(r, 1000));
        useGameStore.getState().endTurn();
      };
      
      runAi();
    }
  }, [currentTurn, phase]);

  const handleVictory = () => {
    unlockLevel(level + 1);
    router.push('/');
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative flex">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 pointer-events-none" />
      
      <div className="flex-1 relative flex flex-col justify-center">
        
        {/* Opponent HUD and Top Controls */}
        <div className="absolute top-4 w-full px-4 flex justify-between text-white z-50">
          <div className="flex gap-2">
            <button 
              onClick={() => router.push('/')}
              className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold backdrop-blur-md"
            >
              ← Mapa
            </button>
            <button 
              onClick={handleVictory}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(22,163,74,0.5)]"
            >
              Simular Vitória (Fase {level})
            </button>
          </div>
          <div className="bg-red-950/50 border border-red-500 rounded-lg px-4 py-2">
            <span className="text-red-400 font-bold">Oponente</span>
          </div>
        </div>

        {/* The Field (Board) */}
        <GameBoard />

        {/* Player HUD */}
        <div className="absolute bottom-32 right-4 flex flex-col items-end gap-2 text-white z-50">
          <div className="bg-blue-950/80 border border-blue-500 rounded-lg px-4 py-2 flex flex-col items-end shadow-xl backdrop-blur-md">
            <span className="text-blue-400 font-bold text-lg">Turno: {currentTurn === 'Player' ? 'Seu' : 'Oponente'}</span>
            <span className="text-white/70 font-semibold text-sm">Fase: {phase === 'Anomaly' ? 'Anomalia' : phase === 'Main' ? 'Principal' : 'Final'}</span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 mt-2">
            {currentTurn === 'Player' && (
              <button 
                onClick={() => {
                  if (phase === 'End') {
                    useGameStore.getState().endTurn();
                  } else {
                    useGameStore.getState().nextPhase();
                  }
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95"
              >
                {phase === 'End' ? 'Encerrar Turno' : 'Passar Fase'}
              </button>
            )}
          </div>
        </div>

        {/* Opponent Hand (Top) */}
        <Hand cards={opponentHand} isOpponent />

        {/* Player Hand (Bottom) */}
        <Hand cards={playerHand} />
        
      </div>
    </div>
  );
};
