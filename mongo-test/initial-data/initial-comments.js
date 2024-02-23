const helloUserID = ObjectId('111111111111111111111111');
const hello2UserID = ObjectId('222222222222222222222222');

db.comments.insertMany([
  {
    _id: ObjectId('123456789123456789123456'),
    message: 'nice pic',
    author: helloUserID,
    date: new Date(),
    __v: 0
  },
  {
    _id: ObjectId('123456789123456789123457'),
    message: 'nice pic',
    author: hello2UserID,
    date: new Date(),
    __v: 0
  },
  {
    _id: ObjectId('123456789123456789123458'),
    message: 'nice pic',
    author: helloUserID,
    date: new Date(),
    __v: 0
  }
])