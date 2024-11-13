const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
    unique: true,    
    trim: true       
  },
  creator_username: {
    type: String,
    required: true,  
    trim: true       
  },
  createdAt: {
    type: Date,
    default: Date.now  
  }
});

roomSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

roomSchema.set('toJSON', {
  virtuals: true,
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
