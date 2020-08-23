const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const { userOne, userOneId, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

afterAll(async () => {
  await mongoose.connection.close();
});

test("should sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "Sebastian",
      email: "pretoriasmith@gmailo.com",
      password: "MyPass1234!",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Sebastian",
      email: "pretoriasmith@gmailo.com",
    },
    token: user.tokens[0].token,
  });

  expect(user.password).not.toBe("MyPass1234!");
});

test("should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);

  expect(response.body).toMatchObject({
    user: {
      email: userOne.email,
      name: userOne.name,
    },
    token: user.tokens[1].token,
  });
});

test("should not login non-existent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "bogus@nono.com",
      password: "Iforgotmypassword",
    })
    .expect(400);
});

test("should not login existing user with incorrect password", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: "Iforgotmypassword",
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should not get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should not delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "newmail@gmail.com",
      name: "New Name",
    })
    .expect(200);

  expect(response.body).toMatchObject({
    name: "New Name",
    email: "newmail@gmail.com",
  });

  const user = await User.findById(userOneId);
  expect(user).toMatchObject({
    name: "New Name",
    email: "newmail@gmail.com",
  });
});

test("should not update invalid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      email: "newmail@gmail.com",
      name: "New Name",
      location: "Buenos Aires",
    })
    .expect(400);
});
