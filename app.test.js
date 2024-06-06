const request = require('supertest');
const express = require('express');
const app = require('./app'); // Adjust the path if needed

describe('POST /input', () => {
    it('should receive and store input data', async () => {
        const response = await request(app)
            .post('/input')
            .send({ distance: 100, uv: 200 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Input data received successfully.');
    });
});

describe('GET /data', () => {
    it('should retrieve stored data', async () => {
        const response = await request(app).get('/data');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('values');
    });
});