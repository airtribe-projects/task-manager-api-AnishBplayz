const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize tasks array from task.json
const taskFilePath = path.join(__dirname, 'task.json');
const taskData = JSON.parse(fs.readFileSync(taskFilePath, 'utf8'));
// Add createdAt and priority to existing tasks if missing
let tasks = taskData.tasks.map((task) => ({
	...task,
	createdAt: task.createdAt || new Date().toISOString(),
	priority: task.priority || 'medium',
}));
let nextId = Math.max(...tasks.map((task) => task.id), 0) + 1;

// Validation helper function
const validateTask = (task) => {
	if (!task.title || typeof task.title !== 'string') {
		return { valid: false, error: 'Title is required and must be a string' };
	}
	if (task.title.trim().length === 0) {
		return { valid: false, error: 'Title cannot be empty' };
	}
	if (!task.description || typeof task.description !== 'string') {
		return { valid: false, error: 'Description is required and must be a string' };
	}
	if (task.description.trim().length === 0) {
		return { valid: false, error: 'Description cannot be empty' };
	}
	if (task.completed === undefined || typeof task.completed !== 'boolean') {
		return { valid: false, error: 'Completed is required and must be a boolean' };
	}
	// Priority is optional, but if provided must be one of: low, medium, high
	if (task.priority !== undefined) {
		const validPriorities = ['low', 'medium', 'high'];
		if (!validPriorities.includes(task.priority)) {
			return {
				valid: false,
				error: 'Priority must be one of: low, medium, high',
			};
		}
	}
	return { valid: true };
};

// REST API v1 router - standard path: /api/v1
const apiV1 = express.Router();

// GET /api/v1/tasks - Retrieve all tasks with filtering and sorting
apiV1.get('/tasks', (req, res) => {
	let filteredTasks = [...tasks];

	// Filter by completion status if provided
	if (req.query.completed !== undefined) {
		const completedFilter = req.query.completed === 'true';
		filteredTasks = filteredTasks.filter((task) => task.completed === completedFilter);
	}

	// Sort by creation date if requested
	if (req.query.sort === 'createdAt' || req.query.sort === '-createdAt') {
		const isDescending = req.query.sort.startsWith('-');
		filteredTasks.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return isDescending ? dateB - dateA : dateA - dateB;
		});
	}

	res.status(200).json(filteredTasks);
});

// GET /api/v1/tasks/priority/:level - Retrieve tasks by priority level
apiV1.get('/tasks/priority/:level', (req, res) => {
	const priorityLevel = req.params.level.toLowerCase();
	const validPriorities = ['low', 'medium', 'high'];

	if (!validPriorities.includes(priorityLevel)) {
		return res.status(400).json({
			error: 'Invalid priority level. Must be one of: low, medium, high',
		});
	}

	const filteredTasks = tasks.filter((task) => task.priority.toLowerCase() === priorityLevel);
	res.status(200).json(filteredTasks);
});

// GET /api/v1/tasks/:id - Retrieve a specific task by ID
apiV1.get('/tasks/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	const task = tasks.find((t) => t.id === id);

	if (!task) {
		return res.status(404).json({ error: 'Task not found' });
	}

	res.status(200).json(task);
});

// POST /api/v1/tasks - Create a new task
apiV1.post('/tasks', (req, res) => {
	const validation = validateTask(req.body);

	if (!validation.valid) {
		return res.status(400).json({ error: validation.error });
	}

	const newTask = {
		id: nextId++,
		title: req.body.title,
		description: req.body.description,
		completed: req.body.completed,
		priority: req.body.priority || 'medium',
		createdAt: new Date().toISOString(),
	};

	tasks.push(newTask);
	res.status(201).json(newTask);
});

// PUT /api/v1/tasks/:id - Update an existing task
apiV1.put('/tasks/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	const taskIndex = tasks.findIndex((t) => t.id === id);

	if (taskIndex === -1) {
		return res.status(404).json({ error: 'Task not found' });
	}

	const validation = validateTask(req.body);

	if (!validation.valid) {
		return res.status(400).json({ error: validation.error });
	}

	// Preserve createdAt, update priority if provided or keep existing
	tasks[taskIndex] = {
		id: id,
		title: req.body.title,
		description: req.body.description,
		completed: req.body.completed,
		priority: req.body.priority !== undefined ? req.body.priority : tasks[taskIndex].priority,
		createdAt: tasks[taskIndex].createdAt, // Preserve original creation date
	};

	res.status(200).json(tasks[taskIndex]);
});

// DELETE /api/v1/tasks/:id - Delete a task
apiV1.delete('/tasks/:id', (req, res) => {
	const id = parseInt(req.params.id, 10);
	const taskIndex = tasks.findIndex((t) => t.id === id);

	if (taskIndex === -1) {
		return res.status(404).json({ error: 'Task not found' });
	}

	const deletedTask = tasks.splice(taskIndex, 1)[0];
	res.status(200).json(deletedTask);
});

// Mount API v1 at /api/v1
app.use('/api/v1', apiV1);

// Only start the server when run directly (e.g. node app.js), not when required by tests
if (require.main === module) {
	app.listen(port, (err) => {
		if (err) {
			if (err.code === 'EADDRINUSE') {
				console.error(
					`Port ${port} is already in use. Stop the other process or run with: PORT=${port + 1} node app.js`,
				);
			} else {
				console.error('Something bad happened', err);
			}
			return;
		}
		console.log(`Server is listening on http://localhost:${port}`);
	});
}

module.exports = app;
