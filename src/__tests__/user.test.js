const mongoose = require('mongoose');

const dbHandler = require('./db-handler');
const userService = require('../user/services/user.service');
const userModel = require('../user/models/user.model');

// connect to the in memory db
beforeAll(async () => await dbHandler.connect());

// clear test data after each test
afterEach(async () => await dbHandler.clearDatabase());

// at the end remove all documents and close the connection
afterAll(async () => await dbHandler.closeDatabase());

const user_id = 'amazingId';
const movie = {
    name: 'Borat',
    fileType: 'video/.mp4',
    size: 53453,
    url: 'https://asdf.com'
}
const anotherMovie = {
    name: 'Jackass 3D',
    fileType: 'video/.mp4',
    size: 1234,
    url: 'https://avc.com'
}

describe('user', () => {
    test('creating user', async () => {
        expect(async () => await userService.addUser(user_id, movie))
        .not
        .toThrow();
    })
    test('exception handling no user_id', async () => {
        expect(async () => await userService.addUser('', movie))
        .rejects
        .toThrow();
    })
    test('exception handling no movie', async () => {
        expect(async () => await userService.addUser(user_id, {}))
        .rejects
        .toThrow();
    })
    test('user to exist after being created', async () => {
        const user = await userService.addUser(user_id, movie);
        const userToFind = await userService.findUser(user_id);
        expect(user.user_id).toEqual(userToFind.user_id);
        expect(JSON.stringify(user.movies[0])).toEqual(JSON.stringify(userToFind.movies[0]));
    })
    test('return null when no user is found', async () => {
        const user = await userService.findUser('inexistent');
        expect(user).toBeNull();
    });
    test('add movie to user', async () => {
        await userService.addUser(user_id, movie);
        const user = await userService.addMovieToUser(user_id, anotherMovie);
        expect(user.movies[1]).toMatchObject(anotherMovie);
    })
    test('testing creating user with updateOrCreateUser', async () => {
        const user = await userService.updateOrCreateUser(user_id, movie);
        const userToFind = await userService.findUser(user_id);
        expect(user.user_id).toEqual(userToFind.user_id);
        expect(JSON.stringify(user.movies[0])).toEqual(JSON.stringify(userToFind.movies[0]));
    })
    test('testing adding movie to user with updateOrCreateUser', async () => {
        await userService.addUser(user_id, movie);
        const user = await userService.updateOrCreateUser(user_id, anotherMovie);
        const userToFind = await userService.findUser(user_id);

        expect(user.user_id).toEqual(userToFind.user_id);
        expect(JSON.stringify(user.movies[0])).toEqual(JSON.stringify(userToFind.movies[0]));
        expect(JSON.stringify(user.movies[1])).toEqual(JSON.stringify(userToFind.movies[1]));
    })
    test.skip('getting a users movies', async () => {
        await userService.addUser(user_id, movie);
        const user = await userService.addMovieToUser(user_id, anotherMovie);
    })
    
})