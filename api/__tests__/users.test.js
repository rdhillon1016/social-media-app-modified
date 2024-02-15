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

    await userTwo.save();

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

describe('Send friend request', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';
  const ALREADY_SENT_REQUEST_USER_ID = '123456789123456789123458';
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'myuser',
      email: 'myuser@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID],
      outgoing_requests: [ALREADY_SENT_REQUEST_USER_ID]
    });
    const friendUser = new User({
      username: 'frienduser',
      email: 'frienduser@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });
    const alreadySentRequestUser = new User({
      username: 'alreadysentrequestuser',
      email: 'alreadysentrequestuser@gmail.com',
      password: await hashPassword('password'),
      _id: ALREADY_SENT_REQUEST_USER_ID,
      incoming_requests: [MY_ID]
    });
    const unknownUser = new User({
      username: 'unknownUser',
      email: 'unknownUser@gmail.com',
      password: await hashPassword('password'),
      _id: UNKNOWN_USER_ID
    });
  
    await userOne.save();
    await friendUser.save();
    await alreadySentRequestUser.save();
    await unknownUser.save();
  
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'myuser',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    await request(app)
      .post(`/users/friend/${UNKNOWN_USER_ID}/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
  });

  test('id is not 24 characters', async () => {
    await request(app)
      .post('/users/friend/12345678912345678912345/request')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('friend doesn\'t exist', async () => {
    await request(app)
      .post('/users/friend/123456789123456789123451/request')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('already friend', async () => {
    await request(app)
      .post(`/users/friend/${FRIEND_ID}/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('already sent friend request', async () => {
    await request(app)
      .post(`/users/friend/${ALREADY_SENT_REQUEST_USER_ID}/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});

describe('Send friend request', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';
  const ALREADY_SENT_REQUEST_USER_ID = '123456789123456789123458';
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'myuser',
      email: 'myuser@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID],
      incoming_requests: [ALREADY_SENT_REQUEST_USER_ID]
    });
    const friendUser = new User({
      username: 'frienduser',
      email: 'frienduser@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });
    const alreadySentRequestUser = new User({
      username: 'alreadysentrequestuser',
      email: 'alreadysentrequestuser@gmail.com',
      password: await hashPassword('password'),
      _id: ALREADY_SENT_REQUEST_USER_ID,
      outgoing_requests: [MY_ID]
    });
    const unknownUser = new User({
      username: 'unknownUser',
      email: 'unknownUser@gmail.com',
      password: await hashPassword('password'),
      _id: UNKNOWN_USER_ID
    });
  
    await userOne.save();
    await friendUser.save();
    await alreadySentRequestUser.save();
    await unknownUser.save();
  
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'myuser',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    await request(app)
      .post(`/users/friend/${ALREADY_SENT_REQUEST_USER_ID}/accept`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
  });

  test('id is not 24 characters', async () => {
    await request(app)
      .post('/users/friend/12345678912345678912345/accept')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('user doesn\'t exist', async () => {
    await request(app)
      .post('/users/friend/123456789123456789123451/accept')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('already friend', async () => {
    await request(app)
      .post(`/users/friend/${FRIEND_ID}/accept`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('accepting friend request when friend request didn\'t actually exist', async () => {
    await request(app)
      .post(`/users/friend/${UNKNOWN_USER_ID}/accept`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});

describe('Update username', () => {
  beforeEach(async () => {
    const userOne = new User({
      username: 'myuser',
      email: 'myuser@gmail.com',
      password: await hashPassword('password')
    });
    const unknownUser = new User({
      username: 'unknownUser',
      email: 'unknownUser@gmail.com',
      password: await hashPassword('password')
    });
  
    await userOne.save();
    await unknownUser.save();
  
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'myuser',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    await request(app)
      .put('/users/update/username/newusername')
      .auth(userToken, { type: 'bearer' })
      .expect(200);
  });

  test('username too long', async () => {
    await request(app)
      .put('/users/update/username/12345678912345678912345678')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('username already taken', async () => {
    await request(app)
      .put('/users/update/username/unknownUser')
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});

describe('Update bio', () => {
  beforeEach(initializeSingleUser);

  test('success', async () => {
    await request(app)
      .put('/users/update/bio')
      .auth(userToken, { type: 'bearer' })
      .send({
        bio: 'x'.repeat(199),
      })
      .expect(200);
  });

  test('bio too long', async () => {
    await request(app)
      .put('/users/update/bio')
      .auth(userToken, { type: 'bearer' })
      .send({
        bio: 'x'.repeat(201),
      })
      .expect(400);
  });
});

describe('Update profile pic', () => {
  beforeEach(initializeSingleUser);

  test('success', async () => {
    await request(app)
      .put('/users/update/profilePic')
      .auth(userToken, { type: 'bearer' })
      .send({
        picUrl: 'https://api.dicebear.com/5.x/big-ears/svg?seed=Felix'
      })
      .expect(200);
  });

  test('picUrl is not a url', async () => {
    await request(app)
      .put('/users/update/profilePic')
      .auth(userToken, { type: 'bearer' })
      .send({
        picUrl: '-wat'
      })
      .expect(400);
  });

  test('picUrl does not lead to dicebear', async () => {
    await request(app)
      .put('/users/update/profilePic')
      .auth(userToken, { type: 'bearer' })
      .send({
        picUrl: 'https://api.something.com/5.x/big-ears/svg?seed=Felix'
      })
      .expect(400);
  });
});

describe('Delete friend', () => {
  const MY_ID = '123456789123456789123456';
  const FRIEND_ID = '123456789123456789123457';
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'myuser',
      email: 'myuser@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      friends: [FRIEND_ID]
    });
    const friendUser = new User({
      username: 'frienduser',
      email: 'frienduser@gmail.com',
      password: await hashPassword('password'),
      _id: FRIEND_ID,
      friends: [MY_ID]
    });
    const unknownUser = new User({
      username: 'unknownUser',
      email: 'unknownUser@gmail.com',
      password: await hashPassword('password'),
      _id: UNKNOWN_USER_ID
    });
  
    await userOne.save();
    await friendUser.save();
    await unknownUser.save();
  
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'myuser',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    await request(app)
      .delete(`/users/delete/${FRIEND_ID}`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
  });

  test('not a friend', async () => {
    await request(app)
      .delete(`/users/delete/${UNKNOWN_USER_ID}`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('id wrong length', async () => {
    await request(app)
      .delete(`/users/delete/1234`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('friend does\'t exist', async () => {
    await request(app)
      .delete(`/users/delete/123456789123456789123451`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});

describe('Delete friend request', () => {
  const MY_ID = '123456789123456789123456';
  const REQUESTING_FRIEND_ID = '123456789123456789123457';
  const UNKNOWN_USER_ID = '123456789123456789123459';

  beforeEach(async () => {
    const userOne = new User({
      username: 'myuser',
      email: 'myuser@gmail.com',
      password: await hashPassword('password'),
      _id: MY_ID,
      incoming_requests: [REQUESTING_FRIEND_ID]
    });
    const friendUser = new User({
      username: 'frienduser',
      email: 'frienduser@gmail.com',
      password: await hashPassword('password'),
      _id: REQUESTING_FRIEND_ID,
      outgoing_requests: [MY_ID]
    });
    const unknownUser = new User({
      username: 'unknownUser',
      email: 'unknownUser@gmail.com',
      password: await hashPassword('password'),
      _id: UNKNOWN_USER_ID
    });
  
    await userOne.save();
    await friendUser.save();
    await unknownUser.save();
  
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'myuser',
        password: 'password',
      })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    [, userToken] = res.body.token.split(' ');
  });

  test('success', async () => {
    await request(app)
      .delete(`/users/delete/${REQUESTING_FRIEND_ID}/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(200);
  });

  test('no friend request', async () => {
    await request(app)
      .delete(`/users/delete/${UNKNOWN_USER_ID}/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('id wrong length', async () => {
    await request(app)
      .delete(`/users/delete/1234/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });

  test('user does\'t exist', async () => {
    await request(app)
      .delete(`/users/delete/123456789123456789123451/request`)
      .auth(userToken, { type: 'bearer' })
      .expect(400);
  });
});