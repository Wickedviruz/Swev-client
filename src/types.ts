// types.ts
export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface Character {
    id: number;
    name: string;
    account_id: number;
    pos_x: number;
    pos_y: number;
    pos_z: number;
    lookbody: number; 
    lookfeet: number; 
    lookhead: number; 
    looklegs: number; 
    looktype: number; 
    direction: number; 
    level: number;
    health: number;
    healthmax: number;
    mana: number;
    manamax: number;
}
