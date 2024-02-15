/* eslint-disable dot-notation */
/* eslint-disable no-undef */
const request = require('supertest');
const db = require('../test_setup/db');
const User = require('../models/User');
const { app } = require('../app');
const { hashPassword } = require('../middleware/query-executors/AuthQueryExecutor');

let userToken;

beforeAll(async () => {
  await db.setUp();
});

const initializeSingleUser = async () => {
  const userOne = new User({
    username: 'user1',
    email: 'testemail@gmail.com',
    password: await hashPassword('password')
  });

  await userOne.save();

  const res = await request(app)
    .post('/auth/login')
    .send({
      username: 'user1',
      password: 'password',
    })
    .expect(200);
  expect(res.body).toHaveProperty('token');
  [, userToken] = res.body.token.split(' ');
}

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('Get own user', () => {
  beforeEach(initializeSingleUser);

  test('get own user success', async () => {
    const res = await request(app)
      .get('/users/user')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body).toHaveProperty('username');
    expect(res.body).not.toHaveProperty('password');
  });
});

describe('Get friends of someone', () => {
  beforeEach(initializeSingleUser);

  test('success', async () => {
    const userTwo = new User({
      username: 'user2',
      email: 'testemail@gmail.com',
      password: await hashPassword('password')
    });

    await userTwo.save();

    const res = await request(app)
      .get('/users/friend/user2')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ username: 'user2' }),
      expect.not.objectContaining({ password: expect.anything() })
    ]))
  });

  test('username too long', async () => {
    await request(app)
      .get('/users/friend/jaelofjejfoilejfioejifjeiojfoi')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('no user with username', async () => {
    await request(app)
      .get('/users/friend/hello')
      .auth(userToken, { type: 'bearer' })
      .expect(404);
  });
});

describe('Get own user\'s friend requests', () => {
  beforeEach(async () => {
    const userTwo = new User({
      username: 'user2',
      email: 'testemail@gmail.com',
      password: await hashPassword('password')
    });

    savedUserTwo = await userTwo.save();

    const userOne = new User({
      username: 'user1',
      email: 'testemail@gmail.com',
      password: await hashPassword('password'),
      incoming_requests: [savedUserTwo._id]
    });

    await userOne.save();

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'user1',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    const res = await request(app)
      .get('/users/friendrequests')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining(
      {
        requests: expect.objectContaining({
          incoming_requests: expect.arrayContaining(
            [
              expect.objectContaining({ username: 'user2' }),
              expect.not.objectContaining({ password: expect.anything() })
            ])
        })
      }))
  });
});

describe('Get own user\'s friend page', () => {
  beforeEach(async () => {
    const userTwo = new User({
      username: 'user2',
      email: 'testemail@gmail.com',
      password: await hashPassword('password')
    });

    savedUserTwo = await userTwo.save();

    const userOne = new User({
      username: 'user1',
      email: 'testemail@gmail.com',
      password: await hashPassword('password'),
      friends: [savedUserTwo._id]
    });

    await userOne.save();

    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'user1',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    const res = await request(app)
      .get('/users/friends/page')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body).toEqual(expect.objectContaining(
      {
        page: expect.objectContaining({
          friends: expect.arrayContaining(
            [
              expect.objectContaining({ username: 'user2' }),
              expect.not.objectContaining({ password: expect.anything() })
            ])
        })
      }))
  });
});

describe('Check username availability', () => {
  beforeEach(async () => {
    const userTwo = new User({
      username: 'user2',
      email: 'testemail@gmail.com',
      password: await hashPassword('password')
    });

    savedUserTwo = await userTwo.save();

    await initializeSingleUser();
  });

  test('success', async () => {
    await request(app)
      .post('/users/user3')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
  });

  test('failure', async () => {
    await request(app)
      .post('/users/user2')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});

// send friend request to someone
// error case: invalid input

// accept some friend request
// error case: invalid input

// update own username
// error case: invalid input

// update bio
// error case: invalid input

// update profile pic
// error case: invalid input

// delete friend
// error case: invalid input

// delete friend request
// error case: invalid input