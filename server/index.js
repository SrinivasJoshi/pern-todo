const express = require('express');
const cors = require('cors');
const pool = require('./db');

// create app
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// ROUTES
// create a todo
app.post('/todos',async (req,res)=>{
    try {
        const { description } = req.body;
        const newTodo = await pool.query(
            "INSERT INTO todo (description) VALUES($1) RETURNING *",
            [description]
        );

        res.json(newTodo.rows[0]);
    } 
    catch (error) {
        console.error(error.message)
    }
})
// get all todo
app.get('/todos',async(req,res)=>{
    try {
        const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id");
        res.json(allTodos.rows);
    } catch (error) {
        console.error(error.message);
    }
})

// get a todo
app.get('/todos/:id',async(req,res)=>{
    try {
        const { id } = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1",[id]);
        res.json(todo.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})
// update a todo
app.put('/todos/:id',async (req,res)=>{
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2"
        ,[description,id]);
        res.json("Todo was updated");
    } catch (error) {
        console.error(error.message);
    }
})

// delete todo
app.delete('/todos/:id',async(req,res)=>{
    try {
        const { id } = req.params;
        const deletedTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1",[id]);
        res.json("Todo deleted");
    } catch (error) {
        console.error(error.message)
    }
})

// START SERVER
app.listen(5000,()=>{
    console.log('server has started on PORT 5000');
});