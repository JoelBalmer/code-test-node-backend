var request = require("supertest");
var app = require("./app");

// Test route
describe("Testing /api/test/", function () {
    it("Respond with: Test worked!", function(done) {
        request(app)
            .get("/api/test/")
            .expect(200, done());
    });
});

// Test Unauthorised
describe("Testing /api/room/ with invalid user", function () {
    it("Respond with json containing a list of all rooms", function(done) {
        request(app)
            .get("/api/room/")
            .set("Authorization", "Basic blabh")
            .expect('Content-Type', /json/)
            .expect(401, done());
    });
});

// Test invalid URL
describe("Testing /api/blah/ with invalid user", function () {
    it("Respond with json containing a list of all rooms", function(done) {
        request(app)
            .get("/api/blah/")
            .set("Authorization", "Basic cm9vdDpzdXBlcnN1cGVyc2VjcmV0")
            .expect('Content-Type', /json/)
            .expect(404, done());
    });
});

// Testing get routes
describe("Testing /api/room/", function () {
    it("Respond with json containing a list of all rooms", function(done) {
        request(app)
            .get("/api/room/")
            .set("Authorization", "Basic cm9vdDpzdXBlcnN1cGVyc2VjcmV0")
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});

describe("Testing /api/room/:id", function () {
    it("Respond with json containing a room matching the :id", function(done) {
        request(app)
            .get("/api/room/5c029aae65a76f843fd650dc")
            .set("Authorization", "Basic cm9vdDpzdXBlcnN1cGVyc2VjcmV0")
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});

describe("Testing /api/room/usage?startDate=start&endDate=end", function () {
    it("Respond with json containing a list of rooms matching the timeframe", function(done) {
        request(app)
            .get("/api/room/usage?startDate=2018-11-28T19:40:40.738Z&endDate=2018-12-01T14:35:41.119Z")
            .set("Authorization", "Basic cm9vdDpzdXBlcnN1cGVyc2VjcmV0")
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});

describe("Testing /api/room/usage?startDate=start&endDate=end&roomId=id", function () {
    it("Respond with json containing a list of rooms matching the timeframe and roomId", function(done) {
        request(app)
            .get("/api/room/usage?startDate=2018-11-28T19:40:40.738Z&endDate=2018-12-01T14:35:41.119Z&roomId=5c029b6065a76f843fd650e3")
            .set("Authorization", "Basic cm9vdDpzdXBlcnN1cGVyc2VjcmV0")
            .expect('Content-Type', /json/)
            .expect(200, done());
    });
});