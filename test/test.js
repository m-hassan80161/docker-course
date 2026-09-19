const request = require("supertest");
const app = require("../index");

describe("GET /", () => {
  test("should return 200", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
  });

  test("should return the correct message", async () => {
    const response = await request(app).get("/");

    expect(response.text).toBe(
      "<h1>hello from test app hi hi2 hi3</h1>"
    );
  });
});