const mongoose = require('mongoose');

const privateChatRoomSchema = new mongoose.Schema({
  user1: {
    type: String,
    required: true,   // İlk kullanıcı
    trim: true,
  },
  user2: {
    type: String,
    required: true,   // İkinci kullanıcı
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

privateChatRoomSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

privateChatRoomSchema.set('toJSON', {
  virtuals: true,
});

const PrivateChatRoom = mongoose.model('PrivateChatRoom', privateChatRoomSchema);

module.exports = PrivateChatRoom;
