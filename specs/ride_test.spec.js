/* eslint-env node, mocha */
import { expect } from 'chai';

import supertest from 'supertest';

import server from '../src/index';

const api = supertest(server);

describe('Get rides', () => {
  it('it should reurn all rides', (done) => {
    api.get('/api/v1/rides')
      .set('accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should get a ride with key value pairs', (done) => {
    api.get('/api/v1/rides/1')
      .set('accept', 'applicaton.json')
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.not.equal(null);
        expect(res.body).to.have.property('from');
        expect(res.body.from).to.not.equal(null);
        expect(res.body).to.have.property('to');
        expect(res.body.to).to.not.equal(null);
        expect(res.body).to.have.property('time');
        expect(res.body.time).to.not.equal(null);
        expect(res.body).to.have.property('date');
        expect(res.body.date).to.not.equal(null);
        done();
      });
  });

  it('should return an error message ride not found', (done) => {
    api.get('/api/v1/rides/ride')
      .set('accept', 'application.json')
      .expect(404)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.error.text).to.equal('ride not Found');
        done();
      });
  });
});
