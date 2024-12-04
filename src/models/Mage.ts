import { Character } from "./Character";


export class Mage extends Character {
    //Cantidad de poder para lanzar hechizos
    private _magicPower: number; 
    //recursos disponibles para lanzar hechizos.
    private _mana: number; 

    constructor(name: string, level: number, health: number, magicPower: number, mana: number) {
        super(name, level, health);  
        this._magicPower = magicPower;
        this._mana = mana;
    };
    //Metodos Getters
    public get magicPower(): number {
      return this._magicPower;
    };

    public get mana(): number {
      return this._mana;
    };

    //Sets
    public set magicPower(magicPower: number) {
      if (magicPower > 0) {
          this._magicPower = magicPower;
      } else {
          console.log("El poder magico debe ser mayor a cero.");
      };
  };

  public set mana(mana: number) {
      if (mana >= 0) {
          this._mana = mana;
      } else {
          console.log("El mana no puede ser negativo.");
      };
  };

  // Método para lanzar un hechizo
  public castSpell(opponent: Character): void {
    // Verifica si el Mage tiene maná suficiente
      if (this._mana > 0) { 
        //daño que el Mage hace con su hechizo 
          const damage = this._magicPower; 
          // para reducir la salud del oponente 
          opponent.health -= damage; 
          // el amgo gasta 10 de maná por hechizo 
          this._mana -= 10;  
          console.log(`${this.name} lanza un hechizo e inflige ${damage} puntos de daño a ${opponent.name}.`);
      } else {
          console.log(`${this.name} no tiene suficiente mana para lanzar un hechizo.`);
      };
  };

  // Método para recargar maná
  public rechargeMana(amount: number): void {
      if (amount > 0) {
          this._mana += amount;  // Recarga el maná del Mage
          console.log(`${this.name} recarga ${amount} puntos de maná. Mana actual: ${this._mana}`);
      } else {
          console.log("La cantidad de mana a recargar debe ser mayor a cero.");
      };
  };

  // Método específico para el Mage: meditar para recuperar maná
  public meditate(): void {
      const manaRecovered = 20;
      this._mana += manaRecovered;  // Recarga 20 puntos de maná
      console.log(`${this.name} medita y recupera ${manaRecovered} puntos de maná. Mana actual: ${this._mana}`);
  };
  
};


