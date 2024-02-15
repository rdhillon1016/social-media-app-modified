/* eslint-disable dot-notation */
/* eslint-disable no-undef */
const request = require('supertest');
const db = require('../test_setup/db');
const User = require('../models/User');
const Post = require('../models/Post');
const { app } = require('../app');
const { hashPassword } = require('../middleware/query-executors/AuthQueryExecutor');

let userToken;

beforeAll(async () => {
  await db.setUp();
});

afterEach(async () => {
  await db.dropCollections();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('Get feed', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'user1',
      email: 'testemail@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID]
    });
    const friendUser = new User({
      username: 'friend',
      email: 'friend@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });
    const unknownUser = new User({
      username: 'unknown',
      email: 'unknown@gmail.com',
      password: await hashPassword('password'),
      _id: UNKNOWN_USER_ID
    });

    await userOne.save();
    await friendUser.save();
    await unknownUser.save();

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

  test('get feed with 3 posts', async () => {
    const myPost = new Post({
      author: MY_ID,
      message: "hi"
    });
    await myPost.save();

    for (let i = 0; i < 2; i++) {
      const friendPost = new Post({
        author: FRIEND_ID,
        message: "hi"
      });
      await friendPost.save();
    }

    const unknownUserPost = new Post({
      author: UNKNOWN_USER_ID,
      message: "hi"
    });
    await unknownUserPost.save();

    const res = await request(app)
      .get('/posts/homefeed')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body).toHaveProperty('posts');
    expect(res.body.posts).toHaveLength(3);
    expect(res.body.nextPage).toEqual(null);
    expect(res.body.posts).toEqual(expect.arrayContaining([
      expect.objectContaining({ author: expect.objectContaining({ username: "friend" }) }),
      expect.objectContaining({ author: expect.objectContaining({ username: "user1" }) }),
      expect.not.objectContaining({ author: expect.objectContaining({ username: "unknown" }) })
    ]))
  });

  test('get second page of feed with 24 posts', async () => {
    for (let i = 0; i < 24; i++) {
      const friendPost = new Post({
        author: FRIEND_ID,
        message: "hi"
      });
      await friendPost.save();
    }

    const res = await request(app)
      .get('/posts/homefeed?page=1')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.posts).toHaveLength(4);
    expect(res.body.nextPage).toEqual(null);
  });
});

describe('Get feed', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'user1',
      email: 'testemail@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID]
    });
    const friendUser = new User({
      username: 'friend',
      email: 'friend@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });
    const unknownUser = new User({
      username: 'unknown',
      email: 'unknown@gmail.com',
      password: await hashPassword('password'),
      _id: UNKNOWN_USER_ID
    });

    await userOne.save();
    await friendUser.save();
    await unknownUser.save();

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

  test('get feed with 3 posts', async () => {
    const myPost = new Post({
      author: MY_ID,
      message: "hi"
    });
    await myPost.save();

    for (let i = 0; i < 2; i++) {
      const friendPost = new Post({
        author: FRIEND_ID,
        message: "hi"
      });
      await friendPost.save();
    }

    const unknownUserPost = new Post({
      author: UNKNOWN_USER_ID,
      message: "hi"
    });
    await unknownUserPost.save();

    const res = await request(app)
      .get('/posts/homefeed')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body).toHaveProperty('posts');
    expect(res.body.posts).toHaveLength(3);
    expect(res.body.nextPage).toEqual(null);
    expect(res.body.posts).toEqual(expect.arrayContaining([
      expect.objectContaining({ author: expect.objectContaining({ username: "friend" }) }),
      expect.objectContaining({ author: expect.objectContaining({ username: "user1" }) }),
      expect.not.objectContaining({ author: expect.objectContaining({ username: "unknown" }) })
    ]))
  });

  test('get second page of feed with 24 posts', async () => {
    for (let i = 0; i < 24; i++) {
      const friendPost = new Post({
        author: FRIEND_ID,
        message: "hi"
      });
      await friendPost.save();
    }

    const res = await request(app)
      .get('/posts/homefeed?page=1')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.posts).toHaveLength(4);
    expect(res.body.nextPage).toEqual(null);
  });
});

describe('Get own posts', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';

  beforeEach(async () => {
    const userOne = new User({
      username: 'user1',
      email: 'testemail@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID]
    });
    const friendUser = new User({
      username: 'friend',
      email: 'friend@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });

    await userOne.save();
    await friendUser.save();

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
    const myPost = new Post({
      author: MY_ID,
      message: "hi"
    });
    await myPost.save();

    const friendPost = new Post({
      author: FRIEND_ID,
      message: "hi"
    });
    await friendPost.save();

    const res = await request(app)
      .get('/posts/user')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.Posts).toHaveLength(1);
    expect(res.body.Posts).toEqual(expect.arrayContaining([
      expect.objectContaining({ author: MY_ID })
    ]))
  });

  test('no posts', async () => {
    const res = await request(app)
      .get('/posts/user')
      .auth(userToken, { type: 'bearer' })
      .expect(404);
  });
});