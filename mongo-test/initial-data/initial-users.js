const helloUserID = ObjectId('111111111111111111111111')
const hello2UserID = ObjectId('222222222222222222222222')
const hello3UserID = ObjectId('333333333333333333333333')
const hello4UserID = ObjectId('444444444444444444444444')
const hello5UserID = ObjectId('555555555555555555555555')

db.users.insertMany([
  {
    _id: helloUserID,
    username: 'hello',
    password: '$2a$10$9b6h9HuJfg7JrbVkwSooA.qa4H8wtliTE3w8xNUadiMZ/4dkMWNaq',
    email: 'hello@hello.ca',
    profilePicUrl: 'https://api.dicebear.com/5.x/big-ears/svg?seed=Felix',
    date_created: new Date(),
    friends: [hello2UserID],
    outgoing_requests: [hello3UserID],
    incoming_requests: [hello4UserID],
    bio: 'this is my bio',
    signedUpWithSocialMedia: false,
    __v: 0
  },
  {
    _id: hello2UserID,
    username: 'hello2',
    password: '$2a$10$9b6h9HuJfg7JrbVkwSooA.qa4H8wtliTE3w8xNUadiMZ/4dkMWNaq',
    email: 'hello@hello.ca',
    profilePicUrl: 'https://api.dicebear.com/5.x/big-ears/svg?seed=Felix',
    date_created: new Date(),
    friends: [helloUserID],
    outgoing_requests: [],
    incoming_requests: [],
    bio: 'this is my bio and it is a little bit longer than the other ones',
    signedUpWithSocialMedia: false,
    __v: 0
  },
  {
    _id: hello3UserID,
    username: 'hello3',
    password: '$2a$10$9b6h9HuJfg7JrbVkwSooA.qa4H8wtliTE3w8xNUadiMZ/4dkMWNaq',
    email: 'hello@hello.ca',
    profilePicUrl: 'https://api.dicebear.com/5.x/big-ears/svg?seed=Felix',
    date_created: new Date(),
    friends: [],
    outgoing_requests: [],
    incoming_requests: [helloUserID],
    bio: 'this is my bio',
    signedUpWithSocialMedia: false,
    __v: 0
  },
  {
    _id: hello4UserID,
    username: 'hello4',
    password: '$2a$10$9b6h9HuJfg7JrbVkwSooA.qa4H8wtliTE3w8xNUadiMZ/4dkMWNaq',
    email: 'hello@hello.ca',
    profilePicUrl: 'https://api.dicebear.com/5.x/big-ears/svg?seed=Felix',
    date_created: new Date(),
    friends: [],
    outgoing_requests: [helloUserID],
    incoming_requests: [],
    bio: 'this is my bio',
    signedUpWithSocialMedia: false,
    __v: 0
  },
  {
    _id: hello5UserID,
    username: 'hello5',
    password: '$2a$10$9b6h9HuJfg7JrbVkwSooA.qa4H8wtliTE3w8xNUadiMZ/4dkMWNaq',
    email: 'hello@hello.ca',
    profilePicUrl: 'https://api.dicebear.com/5.x/big-ears/svg?seed=Felix',
    date_created: new Date(),
    friends: [],
    outgoing_requests: [],
    incoming_requests: [],
    bio: 'this is my bio',
    signedUpWithSocialMedia: false,
    __v: 0
  }
])