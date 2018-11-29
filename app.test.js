var request = require('supertest');
var app = require('./app.js');

describe('Test the room path', function() {
  test('The GET method should return all rooms', function(done) {
      request(app).get('/api/room/').then( function(response) {
          expect(response.statusCode).toBe(200);
          done();
      });
  });
});