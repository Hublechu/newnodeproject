const express=require('express');
const app=express();
const { Pool } = require('pg');
const bodyParser=require('body-parser');

const port = 3000;
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nodeDB',
    password: 'root123',
    port: 5432, 
  });

  app.get('/get-all', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM user_table');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  app.post('/insert', async (req, res) => {
    try {
      const { name, age, dob, email, phone } = req.body;
  
      const result = await pool.query(
        'INSERT INTO user_table (name, age, dob, email, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, age, dob, email, phone]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.put('/update/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { name, age, dob, email, phone } = req.body;
  
      const result = await pool.query(
        'UPDATE user_table SET name = $1, age = $2, dob = $3, email = $4, phone = $5 WHERE id = $6 RETURNING *',
        [name, age, dob, email, phone, id]
      );
  
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/get/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await pool.query('SELECT * FROM user_table WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Record not found' });
      } else {
        res.status(200).json(result.rows[0]);
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal Server Error');
    }
  });



  
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });