import { Sequelize, Model, DataTypes } from "sequelize";

// 1. Define the specific Model Interface for the EscapeRoom instance
export interface EscapeRoomAttributes {
  layerCount: number;
  timerMinutes: number;
  layers: object; // Using 'object' for JSON types
  keypadCode: string;
  hint: string;
  quizUnlock: string;
  helpContent: string;
  quiz: object; // Using 'object' for JSON types
  h1: string;
  h2: string;
  h3: string;
  hiddenQuestion: string;
  hiddenAnswer: string;
  sequenceChunks: object; // Using 'object' for JSON types

  id?: number; // Primary key (usually an auto-incrementing integer)
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the Model Class Type
// This extends the Sequelize Model and includes the static and instance methods.
export interface EscapeRoomModel
  extends Model<EscapeRoomAttributes>,
    EscapeRoomAttributes {}

// 3. Define the structure of the exported 'db' object
export interface Db { 
  // All these properties MUST be created by your index.js file
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  EscapeRoom: typeof Model & (new () => EscapeRoomModel); 
  // If you added connectAndSync to db in index.js, it must be here:
  connectAndSync: () => Promise<void>; 
}

declare const db: Db;
export default db;
