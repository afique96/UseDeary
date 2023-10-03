const pool = require("../database");
const router = require("express").Router();
const format = require("pg-format");
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);



// Create the "plan" table if it doesn't exist (usually done during app setup)
router.post('/createTable', async (req, res) => {
    try {
  
      const createUserTableQuery = `
      CREATE TABLE IF NOT EXISTS plan (
        plan_id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        days TEXT[] NOT NULL,
        subject TEXT NOT NULL,
        calendar_schedule TEXT,
        paid_suggestions TEXT,
        FOREIGN KEY (user_id) REFERENCES "user"(user_id)
    )
      `;
  
      const { rows } = await pool.query(createUserTableQuery);
  
      res.status(200).json({ message: 'Plan table created successfully.' });
    } catch (error) {
      console.error('Error creating plan table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post('/create', async (req, res) => {
    // Control OpenAI connection
    if (!configuration.apiKey) {
        console.log('no connection')
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    // Extract goal from request
    const { goal } = req.body;

    try {
        const messages = [
            {
                "role": "system",
                "content": `You are the assistant for creating a task list for a random user about a subject that the user will be providing. The main purpose is to create a task list that makes that user better on that topic. You will be creating a task list for a beginner about the topic '${goal}'. The task list needs to be progressive. And if the user wants to shuffle any task, that task should be replaced with a new one that will fit the plan. You need to consider the duration of each task and the required content or material for being able to complete each task. If the user enters irrelevant text please specify you are designed for providing a roadmap for learning about a specific topic. If the user specifies the specific duration to complete the roadmap please allocate tasks accordingly. Otherwise please create a roadmap for 2 weeks. Please add sources to each step so I can easily work on those tasks. Please provide a suggestion calendar schedule at the end of the plan for completing tasks. Please suggest 2 paid contents at the end of the task planning that can support and enhanced the learning process.`
            },
            {
                "role": "user",
                "content": `I want to learn '${goal}' in 2 weeks'. Can you provide me with a day-by-day learning plan?`
            }
        ];
        
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.1
        })

        console.log(messages);
        console.log(response.data.choices[0].message.content); // get assistant's response
        res.status(200).json({ result: response.data.choices[0].message.content }); // send assistant's response
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    errorMessage: error.message,
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
});

router.post('/submitPlan', async (req, res) => {
    try {
      const { user_id, days, subject, calendar_schedule, paid_suggestions } = req.body;

  
      // Insert the plan data into the database
      const insertPlanQuery = `
        INSERT INTO plan (user_id, days, subject, calendar_schedule, paid_suggestions)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
  
      const values = [user_id, days, subject, calendar_schedule, paid_suggestions];
      const { rows } = await pool.query(insertPlanQuery, values);
  
      res.status(201).json({ message: 'Plan submitted successfully', });
    } catch (error) {
      console.error('Error submitting plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/getPlansByUserId/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;

  
      // Query the database to retrieve all plans for the specified user ID
      const getPlansQuery = `
        SELECT * FROM plan
        WHERE user_id = $1
      `;
  
      const { rows } = await pool.query(getPlansQuery, [userId]);
  
      res.status(200).json({ plans: rows });
    } catch (error) {
      console.error('Error retrieving plans by user ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


module.exports = router;