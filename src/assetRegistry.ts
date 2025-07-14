interface SpriteInfo {
  key: string;
  atlas: string;
  frame: string;
}

interface AnimatedSpriteInfo extends SpriteInfo {
  frames: string[]; // För animationer
}

interface TileInfo extends SpriteInfo {
  // Kan ha extra data för kollisioner, etc.
}

export const assetRegistry = {
  // Mappar looktype för karaktärer
  characters: {
    0: { key: 'orc', atlas: 'orc_character' },
    1: { key: 'goblin', atlas: 'goblin_character' },
  },

  // Mappar ID för statiska föremål/plattor
  tiles: {
    100: { key: 'wall', atlas: 'dungeon_tiles', frame: 'wall_0' },
    101: { key: 'ground', atlas: 'dungeon_tiles', frame: 'ground_0' },
  },

  // Mappar ID för items
  items: {
    200: { key: 'sword', atlas: 'weapons', frame: 'sword_0' },
    201: { key: 'potion', atlas: 'consumables', frame: 'potion_0' },
  },

  // Lägg till fler kategorier
  // effects: { ... },
};