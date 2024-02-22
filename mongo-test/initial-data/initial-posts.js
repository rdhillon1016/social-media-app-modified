db.posts.insertMany([
  {
    author: '111111111111111111111111',
    date: "Thu Feb 21 2024 17:26:30 GMT+0000 (Coordinated Universal Time)",
    message: 'this is a post',
    images: 6,
    likes: ['111111111111111111111111', '222222222222222222222222'],
    comments: ['123456789123456789123456', '123456789123456789123457'],
    __v: 0
  },
  {
    author: '222222222222222222222222',
    date: "Thu Feb 20 2024 17:26:30 GMT+0000 (Coordinated Universal Time)",
    message: 'this is a post 2',
    images: 0,
    likes: [],
    comments: ['123456789123456789123458'],
    __v: 0
  },
  {
    author: '111111111111111111111111',
    date: "Thu Feb 19 2024 17:26:30 GMT+0000 (Coordinated Universal Time)",
    message: 'this is a post 4',
    images: 1,
    likes: [],
    comments: [],
    __v: 0
  },
  {
    author: '555555555555555555555555',
    date: "Thu Feb 22 2024 17:26:30 GMT+0000 (Coordinated Universal Time)",
    message: 'this is a post 4',
    images: 0,
    likes: [],
    comments: [],
    __v: 0
  }
])