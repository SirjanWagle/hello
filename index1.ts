import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'persondb',
  password: 'your_password',
  port: 5432,
});

const app = express();
app.use(bodyParser.json());

// Define a persons table schema
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS persons (
    id serial PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL
  );
`;

// Create the persons table
pool.query(createTableQuery);

// GET endpoint to retrieve all persons
app.get('/api/people', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM persons');
    res.json(rows);
  } catch (error) {
    console.error('Error executing SELECT query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST endpoint to create a new person
app.post('/api/people', async (req, res) => {
  const { firstname, lastname, phoneNumber } = req.body;

  try {
    const { rows } = await pool.query(
      'INSERT INTO persons (firstname, lastname, phoneNumber) VALUES ($1, $2, $3) RETURNING *',
      [firstname, lastname, phoneNumber]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error executing INSERT query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ... Add PUT and DELETE endpoints similarly ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
