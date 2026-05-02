'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { generateBasicDeck, cardCatalog } from '../../data/cards';
import { GameBoard } from './GameBoard';
import { Hand } from './Hand';

import { useRouter, useSearchParams } from 'next/navigation';
import { useProgressionStore } from '../../store/progressionStore';
import { CreatureCard } from '../../types/game';

export const GameScreen: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const level = Number(searchParams.get('level')) || 1;
  const { unlockLevel } = useProgressionStore();

  const { startGame, opponentHand, playerHand, currentTurn, phase } = useGameStore();

  useEffect(() => {
    // Inicializa o jogo com decks de 55 cartas
    startGame(generateBasicDeck(), generateBasicDeck());
  }, [startGame]);

  // Simple AI Turn Logic for New Phases
  useEffect(() => {
    if (currentTurn === 'Opponent') {
      const runAi = async () => {
        const store = useGameStore.getState();
        
        // Phase 0: StarCheck
        if (phase === 'StarCheck') {
          await new Promise(r => setTimeout(r, 800));
          store.nextPhase();
        }

        // Phase 1: Anomaly
        if (phase === 'Anomaly') {
          await new Promise(r => setTimeout(r, 1200));
          // Simple AI just skips anomaly for now
          store.nextPhase();
        }

        // Phase 2: MainAction
        if (phase === 'MainAction') {
          await new Promise(r => setTimeout(r, 1500));
          const currentOpponentHand = useGameStore.getState().opponentHand;
          const playableCard = currentOpponentHand.find(c => {
            const cat = cardCatalog.find(cat => cat.id === c.cardId);
            return cat?.type === 'Moon' || cat?.type === 'DwarfPlanet';
          });

          if (playableCard) {
            const cat = cardCatalog.find(cat => cat.id === playableCard.cardId) as CreatureCard;
            if (cat) {
              const oppField = useGameStore.getState().opponentField;
              const emptySlots = cat.allowedSlots.filter(s => !oppField.attack[s] && !oppField.defense[s]);
              if (emptySlots.length > 0) {
                const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
                const mode = Math.random() > 0.6 ? 'Attack' : 'Defense';
                store.playCardToField('Opponent', playableCard.instanceId, randomSlot, mode);
              }
            }
          }
          
          await new Promise(r => setTimeout(r, 800));
          store.nextPhase();
        }

        // Phase 3: Discard
        if (phase === 'Discard') {
          await new Promise(r => setTimeout(r, 1000));
          store.endTurn();
        }
      };
      
      runAi();
    }
  }, [currentTurn, phase]);

  const handleVictory = () => {
    unlockLevel(level + 1);
    router.push('/');
  };

  return (
    <div className="w-full h-screen bg-slate-950 overflow-hidden relative flex">
      {/* Background Stardust */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
      
      <div className="flex-1 relative flex flex-col justify-center">
        
        {/* Top Controls */}
        <div className="absolute top-2 sm:top-4 w-full px-2 sm:px-8 flex justify-between items-start text-white z-50">
          <div className="flex gap-2 sm:gap-4">
            <button 
              onClick={() => router.push('/')}
              className="bg-white/5 hover:bg-white/10 px-3 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold backdrop-blur-md border border-white/10 transition-all flex items-center gap-1 sm:gap-2 text-[10px] sm:text-sm"
            >
              <span className="opacity-50 text-xs sm:text-base">←</span> <span className="max-sm:hidden">Mapa</span>
            </button>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-4">
              <span className="text-white/40 text-[8px] sm:text-[10px] font-black uppercase tracking-widest">Nível {level}</span>
              <div className="w-px h-3 sm:h-4 bg-white/10" />
              <button 
                onClick={handleVictory}
                className="text-emerald-400 hover:text-emerald-300 font-bold text-[8px] sm:text-xs uppercase"
              >
                Vitória
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className="bg-red-500/10 border border-red-500/50 rounded-full px-3 sm:px-6 py-0.5 sm:py-1 backdrop-blur-sm">
                <span className="text-red-400 font-black text-[8px] sm:text-[10px] uppercase tracking-widest">Oponente</span>
             </div>
             {/* Opponent Hand UI rendered separately below */}
          </div>
        </div>


        {/* The Field (Board) */}
        <GameBoard />

        {/* Player HUD Info is now integrated in GameBoard Side Panel */}

        {/* Hands */}
        <div className="absolute top-0 left-0 w-full h-32 z-40 pointer-events-none">
          <Hand cards={opponentHand} isOpponent />
        </div>

        <div className="absolute bottom-0 left-0 w-full z-40 pointer-events-none">
           <Hand cards={playerHand} />
        </div>
        
      </div>
    </div>
  );
};
