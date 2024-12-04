import { Character } from "./Character";

export class Warrior extends Character {
  private _attack: number;
  private _defense: number;
  private _stamina: number; 
  private _isAlive: boolean; 
  private equipment: string[] = []; 

  constructor(name: string, level: number, health: number, attack: number, defense: number) {
    super(name, level, health); 
    this._attack = attack;
    this._defense = defense;
    this._stamina = 100; 
    this._isAlive = true;
  };

  // Getters
  public get attack(): number {
    return this._attack;
  };

  public get defense(): number {
    return this._defense;
  };

  public get stamina(): number {
    return this._stamina;
  };

  public get isAlive(): boolean {
    return this._isAlive;
  };

  // Setters
  public set attack(attack: number) {
    if (attack > 0) {
      this._attack = attack;
    } else {
      console.log("El ataque debe ser mayor a cero.");
    };
  };

  public set defense(defense: number) {
    if (defense >= 0) {
      this._defense = defense;
    } else {
      console.log("La defensa no puede ser negativa.");
    };
  };

  public set stamina(value: number) {
    if (value > 100) {
      this._stamina = 100; // Si el valor es mayor a 100, lo establece en 100
    } else if (value < 0) {
      this._stamina = 0; // Si el valor es menor a 0, lo establece en 0
    } else {
      this._stamina = value; // Si el valor está entre 0 y 100, lo asigna tal cual
    };
  };

  // Propuesta de código verificando la vida, resistencia y manejo de muerte del guerrero
  public attackOpponent(opponent: Warrior): void {
    if (!this._isAlive) {
      console.log(`${this.name} esta muerto y no puede atacar.`);
      return;
    };
    if (this._stamina < 10) {
      console.log(`${this.name} no tiene suficiente resistencia para atacar.`);
      return;
    };

    if (opponent instanceof Warrior) { // Aseguramos que el oponente sea un Warrior
      const damage = this._attack - opponent.defense;
      if (damage > 0) {
        opponent.health -= damage;
        this._stamina -= 10; // Reduce resistencia al atacar
        console.log(`${this.name} inflige ${damage} puntos de daño a ${opponent.name}`);

        if (opponent.health <= 0) {
          opponent._isAlive = false;
          console.log(`${opponent.name} ha sido derrotado.`);
        };
      } else {
        console.log(`${this.name} no puede dañar a ${opponent.name}`);
      };
    } else {
      console.log("El oponente no es un Warrior y no tiene defensa.");
    };
  }

  // Método específico para el Warrior. Defiende.
  public defend(): void {
    console.log(`${this.name} está defendiendo con ${this._defense} puntos de defensa.`);
  };

  // Para regenerar resistencia.
  public regenerateStamina(): void {
    if (this._stamina < 100) {
      this._stamina = Math.min(100, this._stamina + 5); // Incrementa resistencia hasta el máximo de 100
      console.log(`${this.name} ha recuperado 5 puntos de resistencia. Resistencia actual: ${this._stamina}`);
    };
  };

  // Método para equipar un objeto
  public equipItem(item: string): void {
    // Agregar un item al inventario del guerrero, almacenando en el array equipment
    this.equipment.push(item);
    console.log(`${this.name} ha equipado: ${item}`);
  };

  // Método para mostrar el estado actual del Warrior
  public checkStatus(): void {
    console.log(`Estado de ${this.name}:`);
    console.log(`- Salud: ${this.health}`);
    console.log(`- Resistencia: ${this._stamina}`);
    console.log(`- Ataque: ${this._attack}`);
    console.log(`- Defensa: ${this._defense}`);
    console.log(`- Estado: ${this._isAlive ? 'Vivo' : 'Muerto'}`);
    console.log(`- Equipamiento: ${this.equipment.length > 0 ? this.equipment.join(', ') : 'Ninguno'}`);
  };

  // Método para revivir al Warrior si está muerto
  public revive(): void {
    if (!this._isAlive) {
      this._isAlive = true;
      this.health = 50; // Restaura la salud parcialmente al revivir
      console.log(`${this.name} ha sido revivido con 50 puntos de salud.`);
    } else {
      console.log(`${this.name} ya esta vivo.`);
    };
  };

};
