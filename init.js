const { Client } = require('pg');
const dotenv = require('dotenv');
const path =  require('path');

dotenv.config({
  path: path.join(__dirname, 'config', '.env'),
});

console.log('USER: ', process.env.POSTGRES_USER);
console.log('PASSWORD: ', `"${process.env.POSTGRES_PASSWORD}"`);
console.log('password type: ', typeof process.env.POSTGRES_PASSWORD);

const client = new Client({
  user: process.env.POSTGRES_USER,
  password: String(process.env.POSTGRES_PASSWORD) || '',
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT || 5432,
  database: 'postgres',
});

async function createPostgresDb() {
  try {
    await client.connect();
    const name = 'book_cms';
    const { rowCount  } = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${name}'`);
    
    if (!rowCount) {
      await client.query(`CREATE DATABASE ${name}`);
      console.log(`Postgres database ${name} initialized.`);
    } else {
      console.log(`Postgres database ${name} already exists.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

createPostgresDb();

