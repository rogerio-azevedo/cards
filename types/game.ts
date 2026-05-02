export type CardType = 'Star' | 'Planet' | 'Moon' | 'DwarfPlanet' | 'Anomaly';
export type CardRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type BoardPosition = 1 | 2 | 3 | 4 | 5;

export interface BaseCard {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  description: string;
  image?: string; // Optional for now until we have actual assets
}

export interface CreatureCard extends BaseCard {
  type: 'Star' | 'Planet' | 'Moon' | 'DwarfPlanet';
  attack: number;
  defense: number;
  defenseBonus?: number; // Bonus when in Defense mode
  allowedSlots: BoardPosition[]; // 2 slots for Moon/DwarfPlanet. 5 slots for Planets/Stars.
  isGasOrWater?: boolean; // If true, immune to normal physical attacks
}

export interface AnomalyCard extends BaseCard {
  type: 'Anomaly';
  effectId: string; // Used to trigger specific logic
  power?: number; // Optional power for Anomalies like ISS
}

export type Card = CreatureCard | AnomalyCard;

export interface GameCard {
  instanceId: string; // Unique ID for the card instance in the match
  cardId: string; // Reference to the catalog Card ID
  position?: BoardPosition; // 1-5 if on board
  mode?: 'Attack' | 'Defense';
  currentDefense?: number; // Remaining defense
}
