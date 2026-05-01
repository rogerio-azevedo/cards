import { Card } from '../types/game';

export const cardCatalog: Card[] = [
  // --- STARS ---
  {
    id: 'star_sol',
    name: 'Sol',
    type: 'Star',
    rarity: 'Legendary',
    attack: 5000,
    defense: 5000,
    allowedSlots: [1, 2, 3, 4, 5],
    description: 'Gravidade Absoluta: Compra 1 carta a mais por turno. Campo de Proteção: Escolhe 2 espaços para ficarem imunes.'
  },
  {
    id: 'star_ra',
    name: 'Rá',
    type: 'Star',
    rarity: 'Legendary',
    attack: 4500,
    defense: 4500,
    allowedSlots: [1, 2, 3, 4, 5],
    description: 'Multiplicação Cósmica: Sacrifica 4 cartas para invocar 2 Planetas de uma vez.'
  },
  {
    id: 'star_helios',
    name: 'Hélios',
    type: 'Star',
    rarity: 'Legendary',
    attack: 4800,
    defense: 4200,
    allowedSlots: [1, 2, 3, 4, 5],
    description: 'Raio Laser: Causa 500 de dano direto a uma carta inimiga por turno.'
  },

  // --- PLANETS ---
  {
    id: 'planet_earth',
    name: 'Terra',
    type: 'Planet',
    rarity: 'Rare',
    attack: 2000,
    defense: 2500,
    allowedSlots: [1, 2, 3, 4, 5],
    description: 'O pálido ponto azul.'
  },
  {
    id: 'planet_jupiter',
    name: 'Júpiter',
    type: 'Planet',
    rarity: 'Epic',
    attack: 3000,
    defense: 3500,
    allowedSlots: [1, 2, 3, 4, 5],
    isGasOrWater: true,
    description: 'Planeta Gasoso. Imune a ataques físicos normais.'
  },
  {
    id: 'planet_saturn',
    name: 'Saturno',
    type: 'Planet',
    rarity: 'Epic',
    attack: 2800,
    defense: 3200,
    allowedSlots: [1, 2, 3, 4, 5],
    isGasOrWater: true,
    description: 'Planeta Gasoso. Imune a ataques físicos normais.'
  },
  {
    id: 'planet_neptune',
    name: 'Netuno',
    type: 'Planet',
    rarity: 'Epic',
    attack: 2500,
    defense: 2800,
    allowedSlots: [1, 2, 3, 4, 5],
    isGasOrWater: true,
    description: 'Planeta de Água/Gelo. Imune a ataques físicos normais.'
  },
  {
    id: 'planet_pluto',
    name: 'Plutão',
    type: 'Planet',
    rarity: 'Common',
    attack: 1500,
    defense: 1500,
    allowedSlots: [1, 2, 3, 4, 5],
    description: 'O nono planeta.'
  },
  {
    id: 'planet_x',
    name: 'Planeta X',
    type: 'Planet',
    rarity: 'Legendary',
    attack: 4000,
    defense: 4000,
    allowedSlots: [1, 2, 3, 4, 5],
    description: 'A lenda se torna realidade.'
  },

  // --- DWARF PLANETS ---
  {
    id: 'dwarf_ceres',
    name: 'Ceres',
    type: 'DwarfPlanet',
    rarity: 'Common',
    attack: 800,
    defense: 1200,
    allowedSlots: [1, 3],
    description: 'Pequeno, mas resistente.'
  },
  {
    id: 'dwarf_eris',
    name: 'Éris',
    type: 'DwarfPlanet',
    rarity: 'Common',
    attack: 1200,
    defense: 800,
    allowedSlots: [2, 4],
    description: 'A discórdia do sistema solar.'
  },

  // --- MOONS ---
  {
    id: 'moon_luna',
    name: 'Lua (Terra)',
    type: 'Moon',
    rarity: 'Common',
    attack: 1000,
    defense: 1000,
    allowedSlots: [3, 5],
    description: 'Companheira fiel da Terra.'
  },
  {
    id: 'moon_europa',
    name: 'Europa (Júpiter)',
    type: 'Moon',
    rarity: 'Common',
    attack: 900,
    defense: 1500,
    allowedSlots: [1, 5],
    description: 'Esconde um oceano sob o gelo.'
  },

  // --- ANOMALIES ---
  {
    id: 'anomaly_comet_rally',
    name: 'Cometa Rally',
    type: 'Anomaly',
    rarity: 'Legendary',
    effectId: 'DESTROY_2_ANY',
    description: 'Ignora defesa e destrói 2 cartas no tabuleiro inimigo.'
  },
  {
    id: 'anomaly_iss',
    name: 'Estação Internacional',
    type: 'Anomaly',
    rarity: 'Rare',
    effectId: 'ISS_EFFECT',
    power: 1000,
    description: 'Modo 1: Destrói Lua/Anão. Modo 2: Cresce +500 de poder por turno no campo.'
  },
  {
    id: 'anomaly_black_hole',
    name: 'Buraco Negro',
    type: 'Anomaly',
    rarity: 'Legendary',
    effectId: 'RESET_BOARD',
    description: 'Suga e destrói TODAS as cartas do campo de ambos os jogadores.'
  }
];

export const generateBasicDeck = (): Card[] => {
  const deck: Card[] = [];
  
  // Pegar as Luas e Anões para garantir no começo do deck
  const starters = cardCatalog.filter(c => c.type === 'Moon' || c.type === 'DwarfPlanet');
  const planets = cardCatalog.filter(c => c.type === 'Planet');
  const anomalies = cardCatalog.filter(c => c.type === 'Anomaly');
  const star = cardCatalog.find(c => c.type === 'Star');

  // Adicionar pelo menos 10 starters (repetindo os do catálogo)
  for (let i = 0; i < 15; i++) {
    deck.push({ ...starters[i % starters.length] });
  }

  // Adicionar planetas
  for (let i = 0; i < 15; i++) {
    deck.push({ ...planets[i % planets.length] });
  }

  // Adicionar anomalias
  for (let i = 0; i < 9; i++) {
    deck.push({ ...anomalies[i % anomalies.length] });
  }

  // Adicionar a estrela para fechar 40
  if (star) deck.push({ ...star });

  // Embaralhar, MAS manter as primeiras 5 cartas como Luas/Anões para não travar a mão inicial
  const firstFive = deck.splice(0, 5); // Pega 5 starters garantidos
  
  // Embaralha o resto
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Junta tudo
  return [...firstFive, ...deck];
};
