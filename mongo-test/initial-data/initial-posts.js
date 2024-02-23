const helloUserID = ObjectId('111111111111111111111111');
const hello2UserID = ObjectId('222222222222222222222222');
const hello5UserID = ObjectId('555555555555555555555555');

db.posts.insertMany([
  {
    author: helloUserID,
    date: new Date('February 21, 2024 03:24:00'),
    message: 'this is a post',
    images: 6,
    likes: [helloUserID, hello2UserID],
    comments: [
      ObjectId('123456789123456789123456'), 
      ObjectId('123456789123456789123457')
    ],
    __v: 0
  },
  {
    author: hello2UserID,
    date: new Date('February 20, 2024 03:24:00'),
    message: 'this is a post 2',
    images: 0,
    likes: [],
    comments: [ObjectId('123456789123456789123458')],
    __v: 0
  },
  {
    author: helloUserID,
    date: new Date('February 19, 2024 03:24:00'),
    message: 'this is a post 4',
    images: 1,
    likes: [],
    comments: [],
    __v: 0
  },
  {
    author: hello5UserID,
    date: new Date('February 22, 2024 03:24:00'),
    message: 'this is a post 4',
    images: 0,
    likes: [],
    comments: [],
    __v: 0
  }
])