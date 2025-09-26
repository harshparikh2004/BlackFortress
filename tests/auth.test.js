// Automated tests for registration and login endpoints
const request = require('supertest');
const app = require('../backend/server');

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'TestPass123',
                confirmPassword: 'TestPass123',
                role: 'User',
                agreeTerms: true,
                recaptchaToken: 'PLACEHOLDER'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not register with duplicate email', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser2',
                email: 'testuser@example.com',
                password: 'TestPass123',
                confirmPassword: 'TestPass123',
                role: 'User',
                agreeTerms: true,
                recaptchaToken: 'PLACEHOLDER'
            });
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser3',
                email: 'testuser@example.com',
                password: 'TestPass123',
                confirmPassword: 'TestPass123',
                role: 'User',
                agreeTerms: true,
                recaptchaToken: 'PLACEHOLDER'
            });
        expect(res.statusCode).toBe(409);
    });

    it('should login with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'testuser',
                password: 'TestPass123',
                recaptchaToken: 'PLACEHOLDER'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should not login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                identifier: 'testuser',
                password: 'WrongPass',
                recaptchaToken: 'PLACEHOLDER'
            });
        expect(res.statusCode).toBe(401);
    });
});
