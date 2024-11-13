const mongoose = require('mongoose');

const privateRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  creator_username: {
    type: String,
    required: true,
    trim: true,
  },
  invited_users: {
    type: [String],
    default: [],  
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

privateRoomSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

privateRoomSchema.set('toJSON', {
  virtuals: true,
});

const PrivateRoom = mongoose.model('PrivateRoom', privateRoomSchema);

module.exports = PrivateRoom;