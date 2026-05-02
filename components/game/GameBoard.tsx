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
    opponentDeck,
    selectedCardIdFromHand,
    playerHand,
    playCardToField
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
        {/* Opponent Anomaly Zone */}
        <div className="group relative">
          <div className="w-24 h-36 sm:w-32 sm:h-48 border-2 border-dashed border-red-500/30 rounded-xl bg-red-950/10 flex flex-col items-center justify-center transition-all">
            {opponentField.anomalies.length > 0 ? (
              <div className="relative">
                {opponentField.anomalies.map((ano, i) => (
                  <div key={ano.instanceId} className="absolute inset-0" style={{ transform: `translateY(${i * 2}px) scale(${1 - i * 0.05})`, zIndex: 10 - i }}>
                    <div className="w-24 h-36 sm:w-32 sm:h-48 bg-slate-800 rounded-xl border border-red-500/50 shadow-xl" />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-red-500/30 text-[10px] sm:text-xs font-bold text-center px-2 uppercase">Anomalia</span>
            )}
          </div>
        </div>

        {/* Player Anomaly Zone */}
        <div 
          className={cn(
            "group relative transition-all",
            phase === 'Anomaly' && selectedCardIdFromHand && playerHand.find(c => c.instanceId === selectedCardIdFromHand)?.cardId.includes('anomaly') && "scale-110"
          )}
          onClick={() => {
            if (phase === 'Anomaly' && selectedCardIdFromHand) {
              const card = playerHand.find(c => c.instanceId === selectedCardIdFromHand);
              if (card && card.cardId.includes('anomaly')) {
                playCardToField('Player', card.instanceId, 1, 'Attack'); // Slot and mode don't matter for Anomaly
              }
            }
          }}
        >
          <div className={cn(
            "w-24 h-36 sm:w-32 sm:h-48 border-2 border-dashed rounded-xl bg-blue-950/10 flex flex-col items-center justify-center transition-all",
            phase === 'Anomaly' && selectedCardIdFromHand && playerHand.find(c => c.instanceId === selectedCardIdFromHand)?.cardId.includes('anomaly')
              ? "border-blue-400 bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.5)] cursor-pointer"
              : "border-blue-500/30"
          )}>
            {playerField.anomalies.length > 0 ? (
               <div className="flex flex-col items-center">
                 {playerField.anomalies.slice(-1).map(ano => {
                   const cat = useGameStore.getState().playerDeck.find(c => c.id === ano.cardId) || 
                               require('../../data/cards').cardCatalog.find((c: any) => c.id === ano.cardId);
                   return (
                     <div key={ano.instanceId} className="w-24 h-36 sm:w-32 sm:h-48 bg-slate-800 rounded-xl border border-blue-500/50 shadow-xl flex items-center justify-center overflow-hidden">
                       <span className="text-[8px] text-blue-300 font-bold uppercase text-center px-2">{cat?.name}</span>
                     </div>
                   );
                 })}
               </div>
            ) : (
              <span className="text-blue-500/30 text-[10px] sm:text-xs font-bold text-center px-2 uppercase group-hover:text-blue-500">
                {phase === 'Anomaly' && selectedCardIdFromHand && playerHand.find(c => c.instanceId === selectedCardIdFromHand)?.cardId.includes('anomaly')
                  ? "Ativar Aqui"
                  : "Anomalia"}
              </span>
            )}
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
