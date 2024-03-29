// Imports needed to function
import { Client, Account, Databases, Storage, Functions } from "appwrite";

export const API_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
export const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT;
export const DATABASE_ID = import.meta.env.VITE_PUBLIC_DATABASE_ID;
export const MAP_COLLECTION_ID = import.meta.env.VITE_PUBLIC_MAP_COLLECTION_ID;
export const EVENTS_COLLECTION_ID = import.meta.env.VITE_PUBLIC_EVENT_COLLECTION_ID;
export const ALERTS_COLLECTION_ID = import.meta.env.VITE_PUBLIC_ALERTS_COLLECTION_ID;
export const ACCOUNT_RECOVERY_DOMAIN = import.meta.env.VITE_PUBLIC_RECOVERY_DOMAIN;
export const BUCKET_ID = import.meta.env.VITE_PUBLIC_BUCKET_ID;
export const GETUSERS_FUNCTION_ID = import.meta.env.VITE_APPWRITE_GETUSERS_FUNCTION_ID;
export const FAQ_COLLECTION_ID = import.meta.env.VITE_PUBLIC_FAQ_COLLECTION_ID;
export const PARKINFO_COLLECTION_ID = import.meta.env.VITE_PUBLIC_PARKINFO_COLLECTION_ID;

// Create a client to connect
const client = new Client()
    .setEndpoint(API_ENDPOINT)
    .setProject(PROJECT_ID);

export const account = new Account(client); // Named export use {account} when importing
export const database = new Databases(client); // Named export use {databases} when importing
export const storage = new Storage(client); // Named export use {storage} when importing
export const functions = new Functions(client); // Named export use {functions} when importing

export default client; // default export use the word client when exporting