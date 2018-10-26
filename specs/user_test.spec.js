/* eslint-env node, mocha */
import { expect } from 'chai';
import supertest from 'supertest';
import server from '../src/index';

const api = supertest(server);

describe('intergration test for the user controller', () => {
  describe('Create User Controller', () => {
    const user = {
      name: 'amaka',
      password: 12345,
      email: 'amaka@gmail.com',

    };
    it('should be able to create new users', (done) => {
      api.post('/api/v1/auth/signup')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});
