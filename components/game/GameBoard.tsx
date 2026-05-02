import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Field } from './Field';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const GameBoard: React.FC = () => {
  const {
    playerField,
    opponentField,
    phase,
    nextPhase,
    endTurn,
    currentTurn,
    winner,
    startGame,
    playerDeck,
    opponentDeck
  } = useGameStore();

  const phaseNames = {
    StarCheck: '0. Verificação de Estrela',
    Anomaly: '1. Fase de Anomalia',
    MainAction: '2. Ação Principal',
    Discard: '3. Fase de Descarte'
  };

  const isPlayerTurn = currentTurn === 'Player';

  return (
    <div className="w-full max-w-7xl mx-auto h-screen sm:h-[800px] flex flex-col items-center justify-center py-2 sm:py-8 px-2 sm:px-4 relative overflow-x-auto sm:overflow-hidden">




      {/* Winner Overlay */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center"
          >
            <motion.h1
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-8"
            >
              {winner === 'Player' ? 'VOCÊ VENCEU!' : 'OPONENTE VENCEU!'}
            </motion.h1>
            <p className="text-white/60 mb-8 text-xl">Uma estrela foi invocada e o sistema solar se curvou!</p>
            <Button size="lg" onClick={() => startGame(playerDeck, opponentDeck)}>
              Jogar Novamente
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase Info & Controls */}
      <div className={cn(
        "z-20 transition-all shadow-2xl border border-white/10 backdrop-blur-md",
        "fixed sm:absolute top-16 sm:top-1/2 right-2 sm:right-8 sm:-translate-y-1/2",
        "flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 rounded-2xl w-36 sm:w-64 bg-black/60 sm:bg-black/40"
      )}>
        <div className="flex flex-col">
          <span className="text-white/40 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5 sm:mb-1">Turno de</span>
          <span className={cn(
            "text-xs sm:text-xl font-black uppercase italic",
            isPlayerTurn ? "text-blue-400" : "text-red-400"
          )}>
            {isPlayerTurn ? 'Sua Vez' : 'Oponente'}
          </span>
        </div>

        <div className="h-px bg-white/10 my-1 sm:my-2" />

        <div className="flex flex-col gap-1 sm:gap-2 max-sm:hidden">
          {Object.entries(phaseNames).map(([key, name]) => (
            <div
              key={key}
              className={cn(
                "text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all",
                phase === key
                  ? "bg-white/20 text-white shadow-lg border border-white/20 scale-105"
                  : "text-white/20"
              )}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Current Phase indicator for mobile */}
        <div className="sm:hidden mb-1">
           <span className="text-white/60 text-[8px] font-black uppercase tracking-tight truncate block leading-none">
             {phaseNames[phase as keyof typeof phaseNames]}
           </span>
        </div>

        <div className="mt-1 sm:mt-4 flex flex-col gap-1 sm:gap-2">
          {phase === 'StarCheck' && isPlayerTurn && (
            <div className="bg-amber-500/20 border border-amber-500/50 p-2 sm:p-3 rounded-xl mb-1 sm:mb-2 max-sm:hidden">
              <span className="text-[8px] sm:text-[10px] text-amber-500 font-black uppercase">Poder de Estrela</span>
              <p className="text-[7px] sm:text-[9px] text-white/60 mb-1 sm:mb-2">Clique em uma carta inimiga para usar o Raio Laser do Hélios (50 dano).</p>
            </div>
          )}

          {phase === 'Discard' ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-red-500/50 text-red-500 hover:bg-red-500/20 h-8 sm:h-auto text-[10px] sm:text-sm"
              onClick={() => endTurn()}
            >
              Pular Descarte
            </Button>
          ) : (
            <Button
              size="sm"
              className="w-full shadow-lg shadow-blue-500/20 h-8 sm:h-auto text-[10px] sm:text-sm"
              onClick={() => nextPhase()}
              disabled={!isPlayerTurn}
            >
              Próxima Fase
            </Button>
          )}
        </div>
      </div>



      {/* Anomaly Zones */}
      <div className="fixed sm:absolute left-1 sm:left-8 top-1/2 -translate-y-1/2 flex flex-col gap-12 sm:gap-32 z-10 scale-[0.6] sm:scale-100 origin-left">
        <div className="group relative">
          <div className="w-24 h-36 sm:w-32 sm:h-48 border-2 border-dashed border-red-500/50 rounded-xl bg-red-950/20 flex flex-col items-center justify-center transition-all group-hover:border-red-500">
            <span className="text-red-500/50 text-[10px] sm:text-xs font-bold text-center px-2 group-hover:text-red-500 uppercase">Anomalia</span>
          </div>
        </div>
        <div className="group relative">
          <div className="w-24 h-36 sm:w-32 sm:h-48 border-2 border-dashed border-blue-500/50 rounded-xl bg-blue-950/20 flex flex-col items-center justify-center transition-all group-hover:border-blue-500">
            <span className="text-blue-500/50 text-[10px] sm:text-xs font-bold text-center px-2 group-hover:text-blue-500 uppercase">Anomalia</span>
          </div>
        </div>
      </div>



      {/* Opponent Field */}
      <div className="w-full flex justify-center scale-[0.65] sm:scale-90 -translate-y-8 sm:-translate-y-8 z-0">
        <Field field={opponentField} isOpponent />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent absolute top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
        <div className="bg-slate-900/80 border border-white/10 px-2 sm:px-6 py-0.5 sm:py-1 text-white/40 text-[7px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.3em] uppercase rounded-full backdrop-blur-sm">
          Fronteira de Combate
        </div>
      </div>

      {/* Player Field */}
      <div className="w-full flex justify-center scale-[0.65] sm:scale-90 translate-y-8 sm:translate-y-8 z-0">
        <Field field={playerField} />
      </div>



    </div>
  );
};
