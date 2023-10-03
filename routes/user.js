const pool = require("../database");
const bcrypt = require("bcrypt");
const router = require("express").Router();


// Create the "user" table if it doesn't exist (usually done during app setup)
router.post('/createTable', async (req, res) => {
    try {
  
      const createUserTableQuery = `
        CREATE TABLE IF NOT EXISTS "user" (
          id serial PRIMARY KEY,
          username text UNIQUE NOT NULL,
          password text NOT NULL,
          name text,
          surname text,
          email text UNIQUE NOT NULL,
          date_of_birth date,
          account_status text DEFAULT 'active',
          auth_token text,
          sub_tier text DEFAULT free
        )
      `;
  
      const { rows } = await pool.query(createUserTableQuery);
  
      res.status(200).json({ message: 'User table created successfully.' });
    } catch (error) {
      console.error('Error creating user table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get all users from the "user" table
  router.get('/getAll', async (req, res) => {
    try {
  
      const getAllUsersQuery = `
        SELECT * FROM "user"
      `;
  
      const { rows } = await pool.query(getAllUsersQuery);
  
      res.status(200).json({ result: rows });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // get user by id
  router.get("/:id", async (req, res) => {
    try {

      const { id } = req.params;
      const user = await pool.query(
        'SELECT * FROM "public"."user" WHERE user_id = $1',
        [id]
      );
  
      const response = user.rows[0];
  
      res.json(response);
    } catch (err) {
      console.error(err.message);
    }
  });

  router.post("/decreaseCredit/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the user's current credit from the database
        const user = await pool.query(
            'SELECT credit FROM "public"."user" WHERE user_id = $1',
            [id]
        );

        const currentCredit = user.rows[0].credit;

        // Check if the user has enough credit to decrease by 1
        if (currentCredit >= 1) {
            // Decrease the user's credit by 1 in the database
            await pool.query(
                'UPDATE "public"."user" SET credit = credit - 1 WHERE user_id = $1',
                [id]
            );

            res.json({ message: "Credit decreased by 1" });
        } else {
            res.status(403).json({ error: "Insufficient credit to decrease" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred" });
    }
});




module.exports = router;