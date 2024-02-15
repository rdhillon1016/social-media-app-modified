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

describe('Get other person\'s posts', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';
  const OUTGOING_USER_ID = '123456789123456789123458'
  const INCOMING_USER_ID = '123456789123456789123455'
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'user1',
      email: 'testemail@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID],
      incoming_requests: INCOMING_USER_ID,
      outgoing_requests: OUTGOING_USER_ID
    });
    const friendUser = new User({
      username: 'friend',
      email: 'friend@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });
    const outgoingUser = new User({
      username: 'outgoing',
      email: 'outgoing@gmail.com',
      password: await hashPassword('password'),
      _id: OUTGOING_USER_ID,
      incoming_requests: [MY_ID]
    });
    const incomingUser = new User({
      username: 'incoming',
      email: 'incoming@gmail.com',
      password: await hashPassword('password'),
      _id: INCOMING_USER_ID,
      outgoing_requests: [MY_ID]
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
    await outgoingUser.save();
    await incomingUser.save();

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
    const friendPost = new Post({
      author: FRIEND_ID,
      message: "hi"
    });
    await friendPost.save();

    const res = await request(app)
      .get(`/posts/user/${FRIEND_ID}`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.Posts).toHaveLength(1);
    expect(res.body).toHaveProperty("User");
    expect(res.body.status).toEqual({
      isFriend: true,
      requestSent: false,
      requestIncoming: false
    });
    expect(res.body.Author).toEqual(expect.objectContaining({
      _id: FRIEND_ID
    }))
    expect(res.body.Author).toEqual(expect.not.objectContaining({
      password: expect.anything()
    }))
  });

  test('incoming friend request', async () => {
    const incomingPost = new Post({
      author: INCOMING_USER_ID,
      message: "hi"
    });
    await incomingPost.save();

    const res = await request(app)
      .get(`/posts/user/${INCOMING_USER_ID}`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.Posts).toEqual(null);
    expect(res.body).toHaveProperty("User");
    expect(res.body.status).toEqual({
      isFriend: false,
      requestSent: false,
      requestIncoming: true
    });
    expect(res.body.Author).toEqual(expect.objectContaining({
      _id: INCOMING_USER_ID
    }))
    expect(res.body.Author).toEqual(expect.not.objectContaining({
      password: expect.anything()
    }))
  });

  test('outgoing friend request', async () => {
    const outgoingPost = new Post({
      author: OUTGOING_USER_ID,
      message: "hi"
    });
    await outgoingPost.save();

    const res = await request(app)
      .get(`/posts/user/${OUTGOING_USER_ID}`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.Posts).toEqual(null);
    expect(res.body).toHaveProperty("User");
    expect(res.body.status).toEqual({
      isFriend: false,
      requestSent: true,
      requestIncoming: false
    });
    expect(res.body.Author).toEqual(expect.objectContaining({
      _id:  OUTGOING_USER_ID
    }))
    expect(res.body.Author).toEqual(expect.not.objectContaining({
      password: expect.anything()
    }))
  });

  test('unknown user', async () => {
    const unknownPost = new Post({
      author: UNKNOWN_USER_ID,
      message: "hi"
    });
    await unknownPost.save();

    const res = await request(app)
      .get(`/posts/user/${UNKNOWN_USER_ID}`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
    expect(res.body.Posts).toEqual(null);
    expect(res.body).toHaveProperty("User");
    expect(res.body.status).toEqual({
      isFriend: false,
      requestSent: false,
      requestIncoming: false
    });
    expect(res.body.Author).toEqual(expect.objectContaining({
      _id: UNKNOWN_USER_ID
    }))
    expect(res.body.Author).toEqual(expect.not.objectContaining({
      password: expect.anything()
    }))
  });

  test('id length is not 24 characters', async () => {
    await request(app)
      .get('/posts/123348849327')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});