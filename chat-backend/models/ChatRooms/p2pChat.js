const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  password: {
    type: String,
    required: true,  // Şifre
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

// Şifreyi hashleme işlemi
privateChatRoomSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Şifre doğrulama işlemi
privateChatRoomSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const PrivateChatRoom = mongoose.model('PrivateChatRoom', privateChatRoomSchema);

module.exports = PrivateChatRoom;
