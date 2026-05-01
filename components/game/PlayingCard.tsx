import React from 'react';
import { Card as CardType, CreatureCard } from '../../types/game';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Shield, Swords, Zap, Star } from 'lucide-react';

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
  isFaceDown?: boolean;
}

const rarityColors = {
  Common: 'bg-slate-300 border-slate-400 text-slate-800',
  Rare: 'bg-blue-300 border-blue-500 text-blue-900',
  Epic: 'bg-purple-300 border-purple-500 text-purple-900',
  Legendary: 'bg-amber-300 border-yellow-500 text-amber-900',
};

const typeIcons = {
  Star: Star,
  Planet: Zap,
  Moon: Shield,
  DwarfPlanet: Shield,
  Anomaly: Zap,
};

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, onClick, className, isFaceDown = false }) => {
  if (isFaceDown) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={cn(
          "w-32 h-48 rounded-xl border-4 border-indigo-900 bg-indigo-950 flex items-center justify-center cursor-pointer shadow-lg",
          className
        )}
        onClick={onClick}
      >
        <div className="w-24 h-36 border-2 border-indigo-800/50 rounded-lg flex items-center justify-center opacity-50">
          <Star className="w-12 h-12 text-indigo-800" />
        </div>
      </motion.div>
    );
  }

  const isCreature = card.type !== 'Anomaly';
  const creatureCard = isCreature ? (card as CreatureCard) : null;
  const TypeIcon = typeIcons[card.type];

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "w-36 h-52 rounded-xl border-4 flex flex-col p-2 relative shadow-lg select-none",
        rarityColors[card.rarity],
        className
      )}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-xs truncate max-w-[80%]">{card.name}</span>
        <TypeIcon className="w-4 h-4" />
      </div>

      {/* Image / Art Placeholder */}
      <div className="flex-1 w-full bg-black/10 rounded-md border border-black/10 mb-1 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder Art */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white/40 to-black/20 flex items-center justify-center shadow-inner relative">
          {/* Cute Face Placeholder */}
          <div className="absolute top-4 left-3 w-2 h-2 bg-black rounded-full" />
          <div className="absolute top-4 right-3 w-2 h-2 bg-black rounded-full" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-full" />
        </div>
      </div>

      {/* Description */}
      <div className="h-12 text-[9px] leading-tight overflow-hidden text-black/80 font-medium">
        {card.description}
      </div>

      {/* Stats row for Creatures */}
      {isCreature && creatureCard && (
        <div className="flex justify-between items-end mt-auto pt-1 border-t border-black/10">
          <div className="flex items-center gap-1 font-bold text-xs bg-red-500/20 px-1 rounded">
            <Swords className="w-3 h-3" />
            {creatureCard.attack}
          </div>
          <div className="flex items-center gap-1 font-bold text-xs bg-blue-500/20 px-1 rounded">
            <Shield className="w-3 h-3" />
            {creatureCard.defense}
          </div>
        </div>
      )}

      {/* Slots Allowed */}
      {isCreature && creatureCard && (
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 flex gap-0.5">
          {/* We will show small numbers as a badge */}
        </div>
      )}

      {/* Allowed Slots badges on top edge */}
      {isCreature && creatureCard && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
          {creatureCard.allowedSlots.map(slot => (
            <div key={slot} className="w-4 h-4 bg-black text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow">
              {slot}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
