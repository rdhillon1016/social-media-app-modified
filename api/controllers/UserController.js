const { sendResponseOnError } = require("../middleware/validators/util");
const q = require("../middleware/query-executors/UserQueryExecutor");
const v = require("../middleware/validators/UserValidator");

exports.getUser = [q.getUser];

exports.findUsers = [
  ...v.validateUsername, 
  sendResponseOnError, 
  q.getUsersContainingText
];

exports.postSendFriendRequest = [
  ...v.validateFriendIdParams,
  ...v.validateFriend,
  ...v.checkAlreadySentRequest,
  ...v.checkIfFriends,
  sendResponseOnError,
  q.postSendFriendRequest,
];

exports.getFriendsPage = [q.getFriendsPage];
exports.getUserFriendRequests = [q.getFriendRequests];
exports.postAcceptFriendRequest = [
  ...v.validateFriendIdParams,
  ...v.validateFriend,
  ...v.checkIfFriends,
  ...v.checkIncomingFriendRequestExists,
  sendResponseOnError,
  q.postAcceptFriendRequest,
];
exports.deleteFriendRequest = [
  ...v.validateFriendIdParams,
  ...v.validateFriend,
  ...v.checkIncomingFriendRequestExists,
  sendResponseOnError,
  q.deleteFriendRequest,
];
exports.deleteFriend = [
  ...v.validateFriendIdParams,
  ...v.validateFriend,
  ...v.checkIfInFriendsList,
  sendResponseOnError,
  q.deleteFriend,
];

exports.updateUsername = [
  ...v.validateUsername,
  ...v.originalUsername,
  sendResponseOnError,
  q.putUpdateUsername,
];

exports.updateProfilePic = [
  ...v.validatePicUrl,
  sendResponseOnError,
  q.putUpdateProfilePic,
];
exports.updateBio = [...v.validateBio, sendResponseOnError, q.putUpdateBio];

exports.checkAvailibility = [
  ...v.validateUsername,
  ...v.originalUsername,
  sendResponseOnError,
  q.originalName,
];
