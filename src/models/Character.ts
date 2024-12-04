import { Mission } from './Mission';

// Clase para representar a un personaje en el juego
export class Character {
    private _name: string;
    private _level: number;
    private _health: number;
    private _experience: number;  
    private _inventory: string[]=[];
    missions: Mission[];
   

 // Constructor que inicializa los atributos del personaje
    constructor(name: string, level: number = 1, health: number = 100) {
        this._name = name;
        this._level = level;
        this._health = health;
        this._experience = 0;
        this._inventory = [];
        this.missions = [];
        
    };
    //Metodos de get  
    public get name(): string {
      return this._name
    };

    public get level(): number {
      return this._level
    };

    public get health(): number {
      return this._health
    };

    public get experience(): number {
      return this._experience
    };

    public get inventory(): string[] {
      return this._inventory;
    };

    // Setter para el nombre del personaje

    //Permite actualizar el nombre del personaje
    public set name(name: string) {
      if(name && name.trim().length > 0) {
        this._name = name;
      } else {
        console.log("El Nombre no puede quedar vacio");
        };
    };

    // Setter para el nivel del personaje
    // Actualizar nivel confirmando que sea un mumero positivo
    public set level(level: number) {
      if(level > 0) {
        this._level = level;
      } else {
        console.log("El nivel debe ser un número positivo.");
        };
   };

   //Setter para la salud del  personaje
   // Actualiza la salud asegurandose de que no sea negativa
    public set health(health: number) {
      if(health >= 0 && health <= 100) { //Agregamos un limite maximo de salud
        this._health = health;
      } else {
        console.log("La salud debe estar entre 0 y 100");
        
      };
    };

    // Setter para la experiencia del personaje
    // Permite actualizar la experiencia, asegurándose de que no sea negativa.
    public set experience(experience: number) {
      if(experience >= 0) {
        this._experience = experience;
      } else {
        console.log("La experiencia no puede ser un número negativo.");
        
      };
    };


    // Setter para el inventario
    // Permite actualizar el inventario con un array de strings.
    public set inventory(inventory: string[]) {
      if(Array.isArray(inventory)) {
        this._inventory = inventory;
      } else {
        console.log("El inventario debe ser de cadenas de texto");
        
      };
    };

 // Método para añadir un item al inventario
 addItem(item: string) {
  if (!this.inventory.includes(item)) {
      this.inventory.push(item);
      console.log(`${item} agregado al inventario de ${this.name}.`);
  } else {
      console.log(`${item} ya está en el inventario de ${this.name}.`);
  };
};

   // Método para eliminar un ítem del inventario. Devuelve un booleano si el ítem fue eliminado correctamente
    public removeItem(item: string): boolean {
        const index = this._inventory.indexOf(item);
        if (index !== -1) {
          this._inventory.splice(index, 1);
          return true;
        }
        return false;
      };

      // Método para restaurar salud
      public heal(amount: number): void {
        if(amount > 0) {
          this._health = Math.min(this._health + amount, 100); //No superar el maximo de 100 de salud
          console.log(`${this._name} ha restaurado ${amount} puntos de salud. Salud actual ${this._health}`);
          
        } else {
          console.log("La cantidad de salud a restaurar debe ser mayor a 0.");
          
        };
      };
      //Metodo para subir de nivel
      public levelUp(): void {
        const experienceRequiredForLevelUp = 100;  // Ajustamos la experiencia necesaria según el nivel

        if(this._experience >= experienceRequiredForLevelUp) {
          this._level += 1;
          this._experience -= experienceRequiredForLevelUp; // Restamos la experiencia para el siguiente nivel
          // this._experience = 0; //Reiniciar experiencia a 0 al subir de nivel.
          console.log(`${this._name} ha subido al nivel ${this._level}!`);

      // Aumentamos atributos al subir de nivel
          this._health = Math.min(this._health + 10, 100);  // Aumentamos la salud (pero no más de 100)
          console.log(`${this._name} ha subido al nivel ${this._level}!`);
          console.log(`${this._name} ahora tiene ${this._health} puntos de salud.`);
      
        } else {
          console.log(`${this.name} necesita mas experiencia para subir de nivel.`);
          
        };
      };
      //Metodo para completar una mision y ganar experiencia
      public completeMission(experienceGained: number): void {
        if(experienceGained > 0) {
          this._experience += experienceGained;
          console.log(`${this._name} ha ganado ${experienceGained} puntos de experiencia`);

          // Verificar si el personaje sube de nivel después de ganar la experiencia
          while (this._experience >= 100) {
            this.levelUp();  // Si tiene suficiente experiencia, sube de nivel
        };
          
      
        } else {
          console.log("La experiencia ganada no puede ser negativa o cero.");
          
        };
      };
    };
