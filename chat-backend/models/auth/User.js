const mongoose = require('mongoose');

// Kullanıcı şeması
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now  
  },
  picture: {
    type: String, 
    default: '',  
  },
  bio: {
    type: String, 
    maxlength: 500, 
    default: '',   
  },
});

userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
