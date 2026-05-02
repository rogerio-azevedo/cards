import { Card, CreatureCard, AnomalyCard } from '../types/game';

export const cardCatalog: Card[] = [
  // --- STARS ---
  {
    id: 'star_sol', name: 'Sol', type: 'Star', rarity: 'Legendary',
    attack: 5000, defense: 5000, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Escolha: Compra +1 carta por turno OU Protege 2 espaços'
  },
  {
    id: 'star_helios', name: 'Hélios', type: 'Star', rarity: 'Legendary',
    attack: 4800, defense: 4500, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Raio Laser: No início do turno, causa 50 de dano direto. 3 usos. Não gasta ação de Anomalia.'
  },
  {
    id: 'star_ra', name: 'Rá', type: 'Star', rarity: 'Legendary',
    attack: 4600, defense: 4700, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Pode sacrificar 4 cartas para invocar 2 planetas de uma vez'
  },

  // --- PLANETS ---
  {
    id: 'planet_mercury', name: 'Mercúrio', type: 'Planet', rarity: 'Common',
    attack: 1200, defense: 1000, defenseBonus: 400, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Em modo defesa ganha +400 de defesa'
  },
  {
    id: 'planet_venus', name: 'Vênus', type: 'Planet', rarity: 'Common',
    attack: 1300, defense: 1100, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Reduz ataque inimigo em 300'
  },
  {
    id: 'planet_earth', name: 'Terra', type: 'Planet', rarity: 'Rare',
    attack: 1500, defense: 1400, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Protege aliado de ataque físico'
  },
  {
    id: 'planet_mars', name: 'Marte', type: 'Planet', rarity: 'Rare',
    attack: 1600, defense: 900, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Atacando primeiro causa +200'
  },
  {
    id: 'planet_jupiter', name: 'Júpiter', type: 'Planet', rarity: 'Epic',
    attack: 2500, defense: 2200, isGasOrWater: true, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Escudo Gasoso: Imune a ataques físicos (só leva dano de Anomalia)'
  },
  {
    id: 'planet_saturn', name: 'Saturno', type: 'Planet', rarity: 'Epic',
    attack: 2300, defense: 2400, defenseBonus: 500, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Em modo defesa ganha +500'
  },
  {
    id: 'planet_uranus', name: 'Urano', type: 'Planet', rarity: 'Epic',
    attack: 2000, defense: 2100, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Imune a mudanças de posição'
  },
  {
    id: 'planet_neptune', name: 'Netuno', type: 'Planet', rarity: 'Epic',
    attack: 2100, defense: 2300, isGasOrWater: true, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Imune a ataques físicos (só leva dano de Anomalia)'
  },
  {
    id: 'planet_pluto', name: 'Plutão', type: 'DwarfPlanet', rarity: 'Common',
    attack: 1100, defense: 1200, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Ao morrer, compra 1 carta'
  },
  {
    id: 'planet_x', name: 'Planeta X', type: 'Planet', rarity: 'Legendary',
    attack: 3000, defense: 2800, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Ignora defesa'
  },

  // --- MOONS ---
  {
    id: 'moon_luna', name: 'Lua', type: 'Moon', rarity: 'Common',
    attack: 500, defense: 600, defenseBonus: 400, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Modo defesa +400'
  },
  {
    id: 'moon_phobos', name: 'Fobos', type: 'Moon', rarity: 'Common',
    attack: 400, defense: 500, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Aumenta Marte em +300 ATK'
  },
  {
    id: 'moon_deimos', name: 'Deimos', type: 'Moon', rarity: 'Common',
    attack: 450, defense: 450, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Aumenta Marte em +300 DEF'
  },
  {
    id: 'moon_io', name: 'Io', type: 'Moon', rarity: 'Common',
    attack: 600, defense: 550, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Dano em área ao chegar'
  },
  {
    id: 'moon_europa', name: 'Europa', type: 'Moon', rarity: 'Common',
    attack: 550, defense: 650, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Cura 300 por turno'
  },
  {
    id: 'moon_ganymede', name: 'Ganimedes', type: 'Moon', rarity: 'Common',
    attack: 700, defense: 600, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Pode atacar defendendo'
  },
  {
    id: 'moon_callisto', name: 'Calisto', type: 'Moon', rarity: 'Common',
    attack: 500, defense: 700, defenseBonus: 400, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Modo defesa +400'
  },
  {
    id: 'moon_titan', name: 'Titã', type: 'Moon', rarity: 'Common',
    attack: 800, defense: 750, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Protege outras luas'
  },
  {
    id: 'moon_enceladus', name: 'Encélado', type: 'Moon', rarity: 'Common',
    attack: 600, defense: 700, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Invoca carta aleatória ao morrer'
  },
  {
    id: 'moon_triton', name: 'Tritão', type: 'Moon', rarity: 'Common',
    attack: 650, defense: 650, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Troca posição inimiga'
  },
  {
    id: 'moon_charon', name: 'Caronte', type: 'Moon', rarity: 'Common',
    attack: 400, defense: 500, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Bônus em Plutão'
  },
  {
    id: 'moon_nix', name: 'Nix', type: 'Moon', rarity: 'Common',
    attack: 350, defense: 550, defenseBonus: 300, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Modo defesa +300'
  },

  // --- DWARF PLANETS ---
  {
    id: 'dwarf_ceres', name: 'Ceres', type: 'DwarfPlanet', rarity: 'Common',
    attack: 600, defense: 700, defenseBonus: 400, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Modo defesa +400'
  },
  {
    id: 'dwarf_eris', name: 'Éris', type: 'DwarfPlanet', rarity: 'Common',
    attack: 800, defense: 750, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Reduz defesa inimiga'
  },
  {
    id: 'dwarf_haumea', name: 'Haumea', type: 'DwarfPlanet', rarity: 'Common',
    attack: 700, defense: 600, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Movimento livre'
  },
  {
    id: 'dwarf_makemake', name: 'Makemake', type: 'DwarfPlanet', rarity: 'Common',
    attack: 650, defense: 650, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Inimigo descarta ao morrer'
  },
  {
    id: 'dwarf_sedna', name: 'Sedna', type: 'DwarfPlanet', rarity: 'Common',
    attack: 750, defense: 800, allowedSlots: [1, 2, 3, 4, 5],
    description: 'Imune a ATK < 700'
  },

  // --- ANOMALIES ---
  {
    id: 'anomaly_comet_rally', name: 'Cometa Rally', type: 'Anomaly', rarity: 'Legendary',
    effectId: 'DESTROY_2_ANY', description: 'Destrói 2 cartas. Ignora defesa.'
  },
  {
    id: 'anomaly_iss', name: 'Estação Espacial', type: 'Anomaly', rarity: 'Rare',
    effectId: 'ISS_EFFECT', power: 1000, description: 'Modo 1: Mata Lua/Anão. Modo 2: Fica no campo com 1000 ATK, ganha +500/turno.'
  },
  {
    id: 'anomaly_gravity', name: 'Distorção Gravitacional', type: 'Anomaly', rarity: 'Common',
    effectId: 'SHUFFLE_ENEMIES', description: 'Embaralha posição e modo das cartas inimigas'
  },
  {
    id: 'anomaly_pulsar', name: 'Estrela Pulsar', type: 'Anomaly', rarity: 'Epic',
    effectId: 'DESTROY_2_RANDOM', description: 'Destrói 2 cartas aleatórias'
  },
  {
    id: 'anomaly_asteroid_belt', name: 'Cinturão de Asteroides', type: 'Anomaly', rarity: 'Rare',
    effectId: 'PROTECT_ALL', description: 'Protege tudo, inclusive de Anomalias'
  },
  {
    id: 'anomaly_black_hole', name: 'Buraco Negro', type: 'Anomaly', rarity: 'Legendary',
    effectId: 'RESET_BOARD', description: 'Zera o campo todo'
  },
  {
    id: 'anomaly_friend_earth', name: 'Amizade - Terra', type: 'Anomaly', rarity: 'Common',
    effectId: 'SACRIFICE_MOON_FOR_EARTH', description: 'Sacrifique Lua para invocar Terra'
  },
  {
    id: 'anomaly_friend_mars', name: 'Amizade - Marte', type: 'Anomaly', rarity: 'Common',
    effectId: 'SACRIFICE_PHOBOS_DEIMOS_FOR_MARS', description: 'Sacrifique Fobos/Deimos para invocar Marte'
  },
  {
    id: 'anomaly_friend_jupiter', name: 'Amizade - Júpiter', type: 'Anomaly', rarity: 'Rare',
    effectId: 'SACRIFICE_MOON_FOR_JUPITER', description: 'Sacrifique Lua para invocar Júpiter'
  },
  {
    id: 'anomaly_friend_neptune', name: 'Amizade - Netuno', type: 'Anomaly', rarity: 'Rare',
    effectId: 'SACRIFICE_TRITON_FOR_NEPTUNE', description: 'Sacrifique Tritão para invocar Netuno'
  }
];

export const generateBasicDeck = (): Card[] => {
  const deck: Card[] = [];
  
  const getCard = (id: string) => cardCatalog.find(c => c.id === id)!;

  // 30 Moons/Dwarfs
  for(let i=0; i<4; i++) deck.push({...getCard('moon_luna')});
  for(let i=0; i<3; i++) deck.push({...getCard('moon_phobos')});
  for(let i=0; i<3; i++) deck.push({...getCard('moon_deimos')});
  for(let i=0; i<3; i++) deck.push({...getCard('dwarf_ceres')});
  for(let i=0; i<2; i++) deck.push({...getCard('moon_io')});
  for(let i=0; i<2; i++) deck.push({...getCard('moon_europa')});
  for(let i=0; i<2; i++) deck.push({...getCard('moon_ganymede')});
  for(let i=0; i<2; i++) deck.push({...getCard('moon_titan')});
  for(let i=0; i<2; i++) deck.push({...getCard('planet_pluto')}); // Plutão is dwarf
  for(let i=0; i<2; i++) deck.push({...getCard('moon_charon')});
  for(let i=0; i<3; i++) deck.push({...getCard('dwarf_makemake')});
  for(let i=0; i<2; i++) deck.push({...getCard('dwarf_sedna')});

  // 15 Planets
  for(let i=0; i<2; i++) deck.push({...getCard('planet_mars')});
  for(let i=0; i<2; i++) deck.push({...getCard('planet_earth')});
  for(let i=0; i<2; i++) deck.push({...getCard('planet_venus')});
  for(let i=0; i<2; i++) deck.push({...getCard('planet_jupiter')});
  for(let i=0; i<2; i++) deck.push({...getCard('planet_saturn')});
  for(let i=0; i<2; i++) deck.push({...getCard('planet_neptune')});
  deck.push({...getCard('planet_uranus')});
  deck.push({...getCard('planet_mercury')});
  deck.push({...getCard('planet_x')});

  // 10 Anomalies
  for(let i=0; i<2; i++) deck.push({...getCard('anomaly_friend_earth')});
  deck.push({...getCard('anomaly_friend_mars')});
  deck.push({...getCard('anomaly_friend_jupiter')});
  for(let i=0; i<2; i++) deck.push({...getCard('anomaly_gravity')});
  deck.push({...getCard('anomaly_asteroid_belt')});
  deck.push({...getCard('anomaly_pulsar')});
  deck.push({...getCard('anomaly_comet_rally')});
  deck.push({...getCard('anomaly_black_hole')});

  // 1 Star (Win condition enabler)
  deck.push({...getCard('star_helios')});

  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};
