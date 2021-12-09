const app = require('../app');
const request = require('supertest');
const createJWKSMock = require('mock-jwks').default;
const FormData = require('form-data');


// const jwt = require('express-jwt');
// const jwtCheck = require('../auth/checkJwt');

// global.jwt = jest.fn()

const jwks = createJWKSMock('https://dev-589liq0e.us.auth0.com/.well-known/jwks.json');
jwks.start();

const token = jwks.token({
    aud: "https://express.sample",
    iss: `https://dev-589liq0e.us.auth0.com/`,
});


describe('POST /upload', () => {
    const file = new Buffer.from('afsdfasdf');
    const form = new FormData();

    form.append('image', file);



    test('posting without token', async () => {
        const response = await request(app)
            .post('/upload')
            .send(file)
            .set('Content-Type', 'multipart/form-data; boundary=--X--');
        expect(response.statusCode).toBe(401);
    });

    test.skip('posting with token',  (done) => {
        // jwt.mockImplementationOnce(() => () => ({ verified: 'true' }));

        request(app)
            .post('/upload')
            .set('Content-Type', 'multipart/form-data; boundary=--X--')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', file, 'file name')
            .expect(200, done);
    });
});