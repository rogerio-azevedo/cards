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
    <div className="w-full max-w-7xl mx-auto h-[800px] flex flex-col items-center justify-between py-8 px-4 relative overflow-hidden">

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
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-64 shadow-2xl z-20">
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Turno de</span>
          <span className={cn(
            "text-xl font-black uppercase italic",
            isPlayerTurn ? "text-blue-400" : "text-red-400"
          )}>
            {isPlayerTurn ? 'Sua Vez' : 'Oponente'}
          </span>
        </div>

        <div className="h-px bg-white/10 my-2" />

        <div className="flex flex-col gap-2">
          {Object.entries(phaseNames).map(([key, name]) => (
            <div
              key={key}
              className={cn(
                "text-xs font-bold px-3 py-2 rounded-lg transition-all",
                phase === key
                  ? "bg-white/20 text-white shadow-lg border border-white/20 scale-105"
                  : "text-white/20"
              )}
            >
              {name}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {phase === 'StarCheck' && isPlayerTurn && (
            <div className="bg-amber-500/20 border border-amber-500/50 p-3 rounded-xl mb-2">
              <span className="text-[10px] text-amber-500 font-black uppercase">Poder de Estrela</span>
              <p className="text-[9px] text-white/60 mb-2">Clique em uma carta inimiga para usar o Raio Laser do Hélios (50 dano).</p>
            </div>
          )}

          {phase === 'Discard' ? (
            <Button
              variant="outline"
              className="w-full border-red-500/50 text-red-500 hover:bg-red-500/20"
              onClick={() => endTurn()}
            >
              Pular Descarte
            </Button>
          ) : (
            <Button
              className="w-full shadow-lg shadow-blue-500/20"
              onClick={() => nextPhase()}
              disabled={!isPlayerTurn}
            >
              Próxima Fase
            </Button>
          )}
        </div>
      </div>

      {/* Anomaly Zones */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-32 z-10">
        <div className="group relative">
          <div className="w-32 h-48 border-2 border-dashed border-red-500/50 rounded-xl bg-red-950/20 flex flex-col items-center justify-center transition-all group-hover:border-red-500">
            <span className="text-red-500/50 text-xs font-bold text-center px-2 group-hover:text-red-500">Anomalia Oponente</span>
          </div>
        </div>
        <div className="group relative">
          <div className="w-32 h-48 border-2 border-dashed border-blue-500/50 rounded-xl bg-blue-950/20 flex flex-col items-center justify-center transition-all group-hover:border-blue-500">
            <span className="text-blue-500/50 text-xs font-bold text-center px-2 group-hover:text-blue-500">Sua Anomalia</span>
          </div>
        </div>
      </div>

      {/* Opponent Field */}
      <div className="w-full flex justify-center scale-90 -translate-y-8 z-0">
        <Field field={opponentField} isOpponent />
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent absolute top-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="bg-slate-900 border border-white/10 px-6 py-1 text-white/40 text-[10px] font-black tracking-[0.3em] uppercase rounded-full backdrop-blur-sm">
          Fronteira de Combate
        </div>
      </div>

      {/* Player Field */}
      <div className="w-full flex justify-center scale-90 translate-y-8 z-0">
        <Field field={playerField} />
      </div>

    </div>
  );
};
