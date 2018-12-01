var request = require("supertest");
var app = require("./app");

describe("Testing /api/test/", function () {
    it("Respond with: Test worked!", function(done) {
        request(app)
            .get("/api/test/")
            .expect(200, done());
    });
});

describe("Testing /api/room/", function () {
    it("Respond with json containing a list of all rooms", function(done) {
        request(app)
            .get("/api/room/")
            .set("Authorization", "Basic cm9vdDpzdXBlcnN1cGVyc2VjcmV0")
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});