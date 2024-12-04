import { Character } from "./Character";

export enum MissionType {
    Main = "Main", 
    Side = "Side", 
    Event = "Event", 
}

export class Mission {
    private _name: string;
    private _description: string;
    private _difficulty: number;
    private _reward: number;
    private _type: MissionType;
    private _isCompleted: boolean = false; 

    constructor(name: string, description: string, difficulty: number, reward: number, type: MissionType) {
        this._name =name;
        this._description = description;
        this._difficulty = difficulty;
        this._reward = reward;
        this._type = type;

    };

    public get name(): string {
        return this._name;
    };

    public get description(): string {
        return this._description;
    };

    public get difficulty(): number {
        return this._difficulty;
    };

    public get reward(): number {
        return this._reward;
    };

    public get type(): MissionType {
        return this._type;
    };

    public get isCompleted(): boolean {
        return this._isCompleted;
    };

    //Metodos set para mofificar los valores 

    public set description(description: string) {
        if (description && description.trim().length > 0) {
            this._description = description;
        } else {
            console.log("La descripcion no puede estar vacia.");
        }
    };

    public set difficulty(difficulty: number) {
        if (difficulty >= 1 && difficulty <= 10) {
            this._difficulty = difficulty;
        } else {
            console.log("La dificultad debe estar entre 1 y 10.");
        }
    };

    public set reward(reward: number) {
        if (reward >= 0) {
            this._reward = reward;
        } else {
            console.log("La recompensa no puede ser negativa.");
        }
    };

    public set type(type: MissionType) {
        this._type = type;
    }

    // Método para completar la misión

    public complete(character: Character): void { //Modificado 

        if (!this._isCompleted) {
            //Actualizamos el valor a True
            this._isCompleted = true;

    // Agrego para incrementar la experiencia del personaje
        character.experience += this._reward;

            console.log(`Misión completada: ${this._description}`);
            console.log(`Tipo de misión: ${this._type}`);
            console.log(`Dificultad: ${this._difficulty}`);
            console.log(`Recompensa obtenida: ${this._reward} puntos de experiencia.`);

        } else {
            console.log("La mision ya ha sido completada.");
        };

    };

    // Método para reiniciar la misión
    public resetMission(): void {
        this._isCompleted = false;
        console.log(`La mision "${this._description}" ha sido reiniciada.`);
    };
};