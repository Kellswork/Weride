/* eslint-env node, mocha */
import { expect } from 'chai';

import supertest from 'supertest';

import server from '../src/index';

const api = supertest(server);


describe('Test for Weride api endpoints', () => {
  describe('POST rides', () => {
    const ride = {
      id: '5',
      name: 'kelechi ogbonna',
      from: 'apapa',
      to: 'ashodi',
      time: '2pm',
      date: '23 september',
    };

    it('should be able to post ride offers', (done) => {
      api.post('/api/v1/rides')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .send(ride)
        .expect(200)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('message');
          expect(res.body.createdRide).to.have.property('name');
          expect(res.body.createdRide).to.have.property('id');
          expect(res.body.createdRide).to.have.property('to');
          expect(res.body.createdRide).to.have.property('from');
          expect(res.body.createdRide).to.have.property('time');
          expect(res.body.createdRide).to.have.property('date');
          done();
        });
    });
  });

  describe('post ride request', () => {
    it('should be able to post request to join a ride', (done) => {
      api.post('/api/v1/rides/:rideId/requests')
        .set('Application', /json/)
        .expect(201)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });


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
  });
  describe('Get a single ride', () => {
    it('should get a single ride with key value pairs', (done) => {
      api.get('/api/v1/rides/1')
        .set('Accept', 'applicaton.json')
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
        .set('Accept', 'application.json')
        .expect(404)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.error.text).to.equal('Ride not found');
          done();
        });
    });
  });
});
