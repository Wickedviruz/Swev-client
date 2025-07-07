// types.ts
export interface User {
  id: number;
  username: string;
  email?: string;
}

export interface Character {
  id: number;
  name: string;
  vocation: string;
  level: number;
}
