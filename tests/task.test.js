const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
  userOne,
  userOneId,
  setupDatabase,
  tasks,
  users,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From my jest",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toBe(false);
});

test("should get userOne's tasks", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200);

  expect(response.body.length).toBe(2);
});

test("should not delete first task when authenticated as userTwo", async () => {
  const response = await request(app)
    .delete(`/tasks/${tasks[0]._id}`)
    .set("Authorization", `Bearer ${users[1].tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(tasks[0]._id);
  expect(task).not.toBeNull();
});
