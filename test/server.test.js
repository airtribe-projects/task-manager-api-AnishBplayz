const tap = require('tap');
const supertest = require('supertest');
const app = require('../app');
const server = supertest(app);

const API_BASE = '/api/v1';

tap.test('POST /api/v1/tasks', async (t) => {
	const newTask = {
		title: 'New Task',
		description: 'New Task Description',
		completed: false,
	};
	const response = await server.post(`${API_BASE}/tasks`).send(newTask);
	t.equal(response.status, 201);
	t.end();
});

tap.test('POST /api/v1/tasks with invalid data', async (t) => {
	const newTask = {
		title: 'New Task',
	};
	const response = await server.post(`${API_BASE}/tasks`).send(newTask);
	t.equal(response.status, 400);
	t.end();
});

tap.test('GET /api/v1/tasks', async (t) => {
	const response = await server.get(`${API_BASE}/tasks`);
	t.equal(response.status, 200);
	t.hasOwnProp(response.body[0], 'id');
	t.hasOwnProp(response.body[0], 'title');
	t.hasOwnProp(response.body[0], 'description');
	t.hasOwnProp(response.body[0], 'completed');
	t.type(response.body[0].id, 'number');
	t.type(response.body[0].title, 'string');
	t.type(response.body[0].description, 'string');
	t.type(response.body[0].completed, 'boolean');
	t.end();
});

tap.test('GET /api/v1/tasks/:id', async (t) => {
	const response = await server.get(`${API_BASE}/tasks/1`);
	t.equal(response.status, 200);
	const expectedTask = {
		id: 1,
		title: 'Set up environment',
		description: 'Install Node.js, npm, and git',
		completed: true,
	};
	t.match(response.body, expectedTask);
	t.end();
});

tap.test('GET /api/v1/tasks/:id with invalid id', async (t) => {
	const response = await server.get(`${API_BASE}/tasks/999`);
	t.equal(response.status, 404);
	t.end();
});

tap.test('PUT /api/v1/tasks/:id', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Task Description',
		completed: true,
	};
	const response = await server.put(`${API_BASE}/tasks/1`).send(updatedTask);
	t.equal(response.status, 200);
	t.end();
});

tap.test('PUT /api/v1/tasks/:id with invalid id', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Task Description',
		completed: true,
	};
	const response = await server.put(`${API_BASE}/tasks/999`).send(updatedTask);
	t.equal(response.status, 404);
	t.end();
});

tap.test('PUT /api/v1/tasks/:id with invalid data', async (t) => {
	const updatedTask = {
		title: 'Updated Task',
		description: 'Updated Task Description',
		completed: 'true',
	};
	const response = await server.put(`${API_BASE}/tasks/1`).send(updatedTask);
	t.equal(response.status, 400);
	t.end();
});

tap.test('DELETE /api/v1/tasks/:id', async (t) => {
	const response = await server.delete(`${API_BASE}/tasks/1`);
	t.equal(response.status, 200);
	t.end();
});

tap.test('DELETE /api/v1/tasks/:id with invalid id', async (t) => {
	const response = await server.delete(`${API_BASE}/tasks/999`);
	t.equal(response.status, 404);
	t.end();
});

tap.teardown(() => {
	process.exit(0);
});
