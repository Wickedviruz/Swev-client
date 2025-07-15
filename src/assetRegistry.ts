interface CharacterLook {
  key: string; // T.ex. 'orc', 'goblin', 'Hero'
  atlas: string; // T.ex. 'orc_character', 'goblin_character', 'players'
}

// Mappar looktype ID till en CharacterLook
export const assetRegistry = {
  // Mappar looktype för karaktärer
  characters: {
    73: { key: 'outfit_73', atlas: 'players' }, // Viktigt: Använd 'outfit_73' som key för att matcha filnamnen
  },

  // Mappar ID för statiska föremål/plattor (ingen ändring behövs här för nu)
  //tiles: {
    //100: { key: 'wall', atlas: 'dungeon_tiles', frame: 'wall_0' },
   // 101: { key: 'ground', atlas: 'dungeon_tiles', frame: 'ground_0' },
  //},

  // Mappar ID för items (ingen ändring behövs här för nu)
  //items: {
  //  200: { key: 'sword', atlas: 'weapons', frame: 'sword_0' },
  //  201: { key: 'potion', atlas: 'consumables', frame: 'potion_0' },
  //},
};