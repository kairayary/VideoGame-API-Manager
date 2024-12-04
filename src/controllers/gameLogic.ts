import * as fs from 'fs';
import * as path from 'path';
import { Character } from "../models/Character";
import { Warrior } from "../models/Warrior";
import { Mage } from "../models/Mage";
import { Mission } from "../models/Mission";
import { MissionType } from '../models/Mission';
import { successProbability } from "../helpers/experienceHelper";  
import { generateRandomEvent } from "../helpers/randomHelper";  
import { CharacterData } from '../models/CharacteData';

// Ruta del archivo donde se guardan los personajes
const CHARACTER_FILE = path.resolve(__dirname, '../data/characters.json');

//Arrays que almacenan la lista de personajes y misiones respectivamente
export let characters: Character[] = []; 
export let missions: Mission[] = []; 

// Función auxiliar para encontrar personajes por nombre en el array characters
function findCharacterByName(name: string): Character | undefined {
    return characters.find(char => char.name.toLowerCase() === name.toLowerCase());
};

// Función para cargar los personajes desde un archivo JSON

function loadCharactersFromFile(): void {

    //verifica si el archivo CHARACTER_FILE existe en el sistema
    if (fs.existsSync(CHARACTER_FILE)) {
        try {
            const data = fs.readFileSync(CHARACTER_FILE, 'utf-8');
            //para convertir la cadena JSON en un array de objetos de tipo CharacterData.
            const loadedCharacters: CharacterData[] = JSON.parse(data);

            //itera sobre cada elemento del array loadedCharacters
            loadedCharacters.forEach((char: CharacterData) => {
                //para evitar el duplicado de personajes
                if (!findCharacterByName(char.name)) { 
                    let character: Character;
                    if (char.type === 'warrior') {
                        character = new Warrior(char.name, char.level, char.health, char.attack, char.defense);
                    } else if (char.type === 'mage') {
                        character = new Mage(char.name, char.level, char.health, char.mana, char.magicPower);
                    } else {
                        character = new Character(char.name, char.level, char.health);
                    };
                    
                    // para signar propiedades
                    character.experience = char.experience || 0;
                    character.inventory = Array.isArray(char.inventory) ? char.inventory : [];
                    character.missions = Array.isArray(char.missions) ? char.missions.map(mission => new Mission(mission.name, mission.description, mission.difficulty, mission.reward, mission.type)) : [];
                    //agregar el personaje a la collección
                    characters.push(character);
                };
            });

            console.log('Personajes cargados correctamente.');
        } catch (error) {
            console.error('Error al leer el archivo de personajes:', error);
        };
    } else {
        console.log('No se encontró el archivo de personajes, creando uno nuevo.');
        fs.writeFileSync(CHARACTER_FILE, '[]');
    };
};

// Función para guardar los personajes en un archivo JSON
function saveCharactersToFile(): void {
    //con el map se transforma cada objeto Character a un formato complatible con JSON
    const charactersData = characters.map((char: Character) => ({
        name: char.name,
        level: char.level,
        health: char.health,
        experience: char.experience,
        inventory: char.inventory,
        type: char instanceof Warrior ? 'warrior' : char instanceof Mage ? 'mage' : 'character',
        attack: char instanceof Warrior ? char.attack : undefined,
        defense: char instanceof Warrior ? char.defense : undefined,
        mana: char instanceof Mage ? char.mana : undefined,
        magicPower: char instanceof Mage ? char.magicPower : undefined,
        missions: char.missions.map(mission => ({
            name: mission.name,
            description: mission.description,
            difficulty: mission.difficulty,
            reward: mission.reward,
            type: mission.type,
        })) 
    }));
    //para escribir en el JSON generado en el archivo CHARACTER_FILE
    fs.writeFileSync(CHARACTER_FILE, JSON.stringify(charactersData, null, 2));
    console.log('Personajes guardados correctamente.');
};

//---Gestión de Personajes---

// Crea un nuevo personaje dependiendo del tipo y lo agrega a la lista
function createCharacter(name: string, level: number, health: number, type: 'warrior' | 'mage' | 'character' = 'character'): void {
    
    //validación de los parámetros de entrada
    if (!name || isNaN(level) || isNaN(health)) {
        console.error('Datos invalidos para crear un personaje.');
        return;
    };

    //Con some para verificamos existe un personaje en la colección characters con el mismo nombre
    const characterExists = characters.some(char => char.name.toLowerCase() === name.toLowerCase());
    if (characterExists) {
        console.error(`El personaje "${name}" ya existe.`);
        return;
    };

    let newCharacter: Character;

    //Dependiendo del type, se crea una instancia de Warrior, Mage, o Character 
    //con los parámetros proporcionados y algunos valores por defecto
    if (type === 'warrior') {
        newCharacter = new Warrior(name, level, health, 10, 5); 
    } else if (type === 'mage') {
        newCharacter = new Mage(name, level, health, 50, 15); 
    } else {
        newCharacter = new Character(name, level, health);
    };

    // agrega el nuevo personaje y se guarda en el archivo json
    characters.push(newCharacter);
    saveCharactersToFile();
    console.log(`Personaje "${name}" (${type}) creado exitosamente.`);
};

// Devuelve la lista completa de personajes en characters
function listCharacters(): Character[] {
    return characters;
};

// busca el personaje por su nombre y, si lo encuentra, actualiza las propiedades level y health, siempre

function updateCharacter(name: string, newLevel: number, newHealth: number): void {
    
    //findIndex para localizar el personaje en el arreglo characters
    const index = characters.findIndex(char => char.name && char.name.toLowerCase() === name.toLowerCase());

    // Si el personaje no se encuentra, mostramos un error y salimos de la función
    if (index === -1) {
        console.log(`No se pudo encontrar el personaje "${name}".`);
      return; 
    };

    // para actualizar los valores
    characters[index].level = newLevel;
    characters[index].health = newHealth;
    console.log(`Nivel y salud del personaje "${name}" actualizado actualizados.`);


    saveCharactersToFile(); 
};


// Elimina un personaje por nombre
function deleteCharacter(name: string): boolean {
    const index = characters.findIndex(
        (char) => char.name && char.name.toLowerCase() === name.toLowerCase()
    );

    if (index > -1) {
        characters.splice(index, 1);
        saveCharactersToFile(); 
        console.log(`Personaje "${name}" eliminado.`);
        return true;
    };

    console.log(`No se pudo encontrar el personaje "${name}".`);
    return false;
};

// Asignar una misión a un personaje
function assignMission(charName: string, missionName: string, description: string, difficulty: number, reward: number, type: MissionType): string {
    const char = findCharacterByName(charName);
    
    //verifica si el personaje existe
    if (!char) {
        return `Personaje "${charName}" no encontrado.`;
    };
    //para verificar si todos los datos para la misión estan presentes y en el formato adecuado 
    if (!missionName || !description || isNaN(difficulty) || isNaN(reward) || !type) {
        return "Datos de mision invalidos.";
    };
 
    //creación de la misión
    const mission = new Mission(missionName, description, difficulty, reward, type);
    console.log(`Mision creada: ${JSON.stringify(mission)}`);  
    char.missions.push(mission);
    console.log(`Misiones de ${char.name}: ${JSON.stringify(char.missions)}`);  

    saveCharactersToFile();
    return `Mision "${missionName}" asignada a "${charName}".`;
};


// Permite completar una misión y sumar una recompensa, sino muestra un mensaje
function completeMission(character: Character, mission: Mission): boolean {
    try {
        // para calcular la probabilidad de éxito
        const successChance = successProbability(character.level, mission.difficulty);

        //para subir el nivel si es aplicable
        if (character.level >= mission.difficulty) {
            
            //si la misión fue exitosa
            character.experience += mission.reward;
            console.log(`${character.name} ha completado la mision.`);
            return true;

        } else {
            console.log(`${character.name} no tiene el nivel suficiente.`);
            return false;
        };
    } catch (error) {
        console.error("Error al completar la mision:", error);
        throw new Error("No se pudo completar la mision.");  
    };
};


// Devuelve la lista de misiones disponibles
function listMissions(): Mission[] {

    //se crea un array vacio donde se almacenarán todas las misiones
    let allMissions: Mission[] = [];

    //para iterar en el array characters
    characters.forEach(character => {
        //devuelve un nuevo arary sin modificar el original
        allMissions = allMissions.concat(character.missions);
    });

    if (allMissions.length === 0) {
        console.log("No hay misiones asignadas.");
        return []; // si no hay misisones retorna un array vacio
    } else {
        return allMissions; 
    };
};


// Función para gestionar el inventario de un personaje, agrega, elimina o lista elementos en su inventario
function manageInventory(charName: string, action: 'add' | 'remove' | 'list', item?: string): string | string[] {
   
    //para buscar el personaje
    const character = findCharacterByName(charName);

    if (!character) {
        return `Personaje "${charName}" no encontrado.`;
    };

    // para agregar, eliminar y listar elementos del inventario
    switch (action) {
        case 'add':
            if (!item) {
                return "Debe especificar un elemento para agregar.";
            }
            character.inventory.push(item);
            saveCharactersToFile();
            return `Elemento "${item}" agregado al inventario de "${charName}".`;

        case 'remove':
            if (!item) {
                return "Debe especificar un elemento para eliminar.";
            };

            //se utiliza el método indexOf() para buscar el índice del elemento item en el arreglo inventory del personaje
            const itemIndex = character.inventory.indexOf(item);
            if (itemIndex === -1) {
                return `Elemento "${item}" no encontrado en el inventario de "${charName}".`;
            };

            //splice() elimina un elemento del arreglo en la posición itemIndex y elimina un solo elemento 
            character.inventory.splice(itemIndex, 1);
            saveCharactersToFile();
            return `Elemento "${item}" eliminado del inventario de "${charName}".`;

        case 'list':
            return character.inventory.length > 0
                ? character.inventory
                : `El inventario de "${charName}" está vacio.`;

        default:
            return "Acción invalida. Use 'add', 'remove' o 'list'.";
    };
};

// Función asíncrona para simular eventos aleatorios en el juego

async function triggerEvent(character: Character): Promise<void> {
    try {
        if (character.health <= 0) {
            console.error(`${character.name} no puede participar en eventos porque esta muerto.`);
            return;
        };

        //Simula un evento aleatorio para un perosnaje (encuentro o recompensa)
        const event = generateRandomEvent();  // Cambié esto para usar `generateRandomEvent`
        console.log(`${character.name} ha tenido un evento: ${event}`);

        //Espera 2 segundos antes de continuar
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula tiempo de evento
        console.log(`${character.name} ha respondido al evento.`);
    } catch (error) {
        console.error("Error al generar el evento:", error);
        throw new Error("No se pudo generar el evento.");  // Agregado manejo de errores
    };
};

// Función para manejar múltiples misiones de forma secuencial usando Promesas
function acceptMissions(character: Character, missions: Mission[]): Promise<void> {
    //Se inicializa el índice de la misión actual en 0
    let currentMissionIndex = 0;

    //Se crea una promesa que se resolverá cuando todas las misiones sean completadas o cuando ocurra un error.
    return new Promise((resolve, reject) => {
        function completeNextMission() {

            //Se verifica si hay misiones pendientes en la lista.
            if (currentMissionIndex < missions.length) {
                //para completar la misión actual
                const mission = missions[currentMissionIndex];
                if (completeMission(character, mission)) {
                    console.log(`Mision completada: ${mission.description}`);
                    //se inscremente el indice de la misión
                    currentMissionIndex++;
                    completeNextMission(); // Pasar a la siguiente misión
                } else {
                    //Si la misión no se completa con éxito, se rechaza la promesa con un error
                    reject(new Error(`${character.name} fallo en la mision ${mission.description}.`));
                }
            } else {
                resolve(); // Todas las misiones completadas
            };
        };

        completeNextMission();
    });
};

// Alternativa de manejo de misiones con callback en caso de fallo
function acceptMissionsWithCallback(character: Character, missions: Mission[], callback: (error: Error | null) => void) {
    let currentMissionIndex = 0;

    //se llama por primera vez para comenzar a completar las misiones.
    function completeNextMission() {
        try {

            //se verifica si el índice de la misión actual es menor que la longitud del arreglo de misiones
            if (currentMissionIndex < missions.length) {
                const mission = missions[currentMissionIndex];

                // si es veradero
                if (completeMission(character, mission)) {
                    console.log(`Mision completada: ${mission.description}`);
                    //se obtiene la misión actual del arreglo de misiones 
                    currentMissionIndex++;
                    // Pasa a la siguiente misión
                    completeNextMission(); 
                } else {
                    callback(new Error(`${character.name} fallo en la mision ${mission.description}.`));
                }
            } else {
                callback(null); // Todas las misiones completadas sin error
            };
        } catch (error) {
            callback(new Error("Error al procesar las misiones."));  // En caso de error general en la ejecución
        };
    };
  
  //se llama a la función completeNextMission de manera recursiva para completar la siguiente misión
    completeNextMission();
};

// // función de carga al iniciar
// loadCharactersFromFile();

export {
    createCharacter,
    listCharacters,
    updateCharacter,
    deleteCharacter,
    assignMission,
    completeMission,
    listMissions,
    triggerEvent,
    acceptMissions,
    acceptMissionsWithCallback,
    loadCharactersFromFile,
    saveCharactersToFile,
    findCharacterByName,
    manageInventory
};
