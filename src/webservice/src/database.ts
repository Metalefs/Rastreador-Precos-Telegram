/* eslint-disable prettier/prettier */
import { MongoClient } from 'mongodb';
// or as an es module:
// import { MongoClient } from 'mongodb'
// Connection URL
export const mongoConnectionString = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(mongoConnectionString);
// Database Name
const dbName = 'products';
export async function dbconnection() {
  // Use connect method to connect to the server
  console.log('Connecting...');
  const connection = await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  return [db, connection, client];
}
