const mongoose = require('mongoose');
const { Schema } = mongoose;

// Message schema definition
const PrivatemessageSchema = new Schema({
  chatId: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

PrivatemessageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

PrivatemessageSchema.set('toJSON', {
  virtuals: true,
});

PrivatemessageSchema.index({ timestamp: 1 });

const Message = mongoose.model('PrivateMessage', PrivatemessageSchema);

module.exports = Message;
