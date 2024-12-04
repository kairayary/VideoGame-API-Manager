import { Mission } from './Mission';
export interface CharacterData {
    name: string;
    level: number;
    health: number;
    experience: number;
    inventory: string[];
    type: string;  // si es un "warrior" o "mage"
    attack: number;
    defense: number;
    mana: number;
    magicPower: number;
    missions: Mission[]
};
