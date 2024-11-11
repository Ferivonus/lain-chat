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
  }
});

// Sanal 'id' alanı ekleyerek _id'yi id olarak döndür
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Bu sanal alanın de serialize edilmesi için
userSchema.set('toJSON', {
  virtuals: true,
});

// Kullanıcı modelini oluştur
const User = mongoose.model('User', userSchema);

module.exports = User;
