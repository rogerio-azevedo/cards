import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Field } from './Field';

export const GameBoard: React.FC = () => {
  const { playerField, opponentField } = useGameStore();

  return (
    <div className="w-full max-w-7xl mx-auto h-[800px] flex flex-col items-center justify-between py-8 px-4 relative">
      
      {/* Anomaly Zones - Left side of the board for Opponent, Right side for Player? 
          Or maybe both on the left, but vertically separated. */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-32">
        <div className="w-32 h-48 border-2 border-dashed border-red-500/50 rounded-xl bg-red-950/20 flex flex-col items-center justify-center">
          <span className="text-red-500/50 text-xs font-bold text-center px-2">Anomalia Oponente</span>
        </div>
        <div className="w-32 h-48 border-2 border-dashed border-blue-500/50 rounded-xl bg-blue-950/20 flex flex-col items-center justify-center">
          <span className="text-blue-500/50 text-xs font-bold text-center px-2">Sua Anomalia</span>
        </div>
      </div>

      {/* Opponent Field */}
      <div className="w-full flex justify-center scale-90 -translate-y-8">
        <Field field={opponentField} isOpponent />
      </div>

      {/* Divider / Center line */}
      <div className="w-full h-px bg-white/10 absolute top-1/2 -translate-y-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]">
        <div className="bg-black px-4 text-white/20 text-xs font-bold tracking-widest uppercase border border-white/10 rounded-full">
          Fronteira Espacial
        </div>
      </div>

      {/* Player Field */}
      <div className="w-full flex justify-center scale-90 translate-y-8">
        <Field field={playerField} />
      </div>

    </div>
  );
};
