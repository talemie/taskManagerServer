// import modules
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const port = 3007;
// create a mysql connection
const mysqlConnection = mysql.createConnection({
	user: "myDBuser",
	password: "Testme1234",
	host: "127.0.0.1",
	database: "mytasks",
});
mysqlConnection.connect((err) => {
	if (err) {
		console.log(err.message);
	} else {
		console.log("MySQL server connected");
	}
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //This middleware function is responsible for parsing the request body if it contains JSON data.
app.use(cors()); //used to enable Cross-Origin Resource
// create tasks table
app.get("/create", (req, res) => {
	let createTask = `CREATE TABLE IF NOT EXISTS TASK(
        task_id int auto_increment,
        task_name varchar(255) not null,
        task_status varchar(255) not null,
        PRIMARY KEY(task_id)
    )`;
	mysqlConnection.query(createTask, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Task table created");
			res.send("Task table created");
		}
	});
});

// Insert data to task table
app.post("/insert", (req, res) => {
	// destructure the request
	const { taskName, taskStatus } = req.body;
	let insertTask = `INSERT INTO TASK (task_name,task_status) VALUES (?,?)`;
	mysqlConnection.query(insertTask, [taskName, taskStatus], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Task added");
			res.send("Task added");
		}
	});
});
// get tasks
app.get("/tasks", (req, res) => {
	let getTasks = `SELECT * FROM TASK`;
	mysqlConnection.query(getTasks, (err, result) => {
		if (err) {
			console.log(err.message);
		} else {
			console.table(result);
			res.send(result);
		}
	});
});

// delete task
app.delete("/remove/:id", (req, res) => {
	let taskId = req.params.id;
	console.log(taskId);
	let deleteTask = `DELETE FROM TASK WHERE task_id=?`;
	mysqlConnection.query(deleteTask, [taskId], (err, result) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Task deleted");
			res.send("Task deleted");
		}
	});
});

// update task
app.put("/update/:id", (req, res) => {
	let { taskStatus } = req.body;
	let taskId = req.params.id;
	let updateTask = `UPDATE task SET task_status=? WHERE task_id=?`;
	mysqlConnection.query(updateTask, [taskStatus, taskId], (err, result) => {
		if (err) {
			console.log(err.message);
		} else {
			console.log("Task status updated");
			res.send("Task status updated");
		}
	});
});

// Server listening
app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server Running on: http://localhost:${port}`);
});
