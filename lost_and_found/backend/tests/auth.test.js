import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";

vi.mock("../models/userModel.js", () => ({
  createUser: vi.fn(),
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
}));

const { createUser, findUserByEmail } = await import("../models/userModel.js");
const { default: app } = await import("../app.js");

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects invalid signup payloads before calling the database", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({ name: "", email: "test@example.com", password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid signup information");
    expect(findUserByEmail).not.toHaveBeenCalled();
    expect(createUser).not.toHaveBeenCalled();
  });

  it("creates a user when signup information is valid and email is unused", async () => {
    findUserByEmail.mockImplementationOnce((email, callback) => callback(null, []));
    createUser.mockImplementationOnce((name, email, hashedPassword, callback) => {
      callback(null, { insertId: 1 });
    });

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Josie Bruin",
        email: "josie@example.com",
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User registered successfully");
    expect(findUserByEmail).toHaveBeenCalledWith("josie@example.com", expect.any(Function));
    expect(createUser).toHaveBeenCalledWith(
      "Josie Bruin",
      "josie@example.com",
      expect.any(String),
      expect.any(Function)
    );
  });

  it("rejects signup when email is already registered", async () => {
    findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [{ id: 1, email }])
    );

    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Josie Bruin",
        email: "josie@example.com",
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already registered");
    expect(createUser).not.toHaveBeenCalled();
  });

  it("logs in with valid credentials", async () => {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [
        {
          id: 7,
          name: "Josie Bruin",
          email,
          password: hashedPassword,
        },
      ])
    );

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "josie@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.user).toEqual({
      id: 7,
      name: "Josie Bruin",
      email: "josie@example.com",
    });
  });

  it("rejects login with the wrong password", async () => {
    const hashedPassword = bcrypt.hashSync("password123", 10);
    findUserByEmail.mockImplementationOnce((email, callback) =>
      callback(null, [
        {
          id: 7,
          name: "Josie Bruin",
          email,
          password: hashedPassword,
        },
      ])
    );

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "josie@example.com", password: "wrong-password" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid password");
  });
});
