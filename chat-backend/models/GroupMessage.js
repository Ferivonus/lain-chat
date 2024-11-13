const mongoose = require('mongoose');
const { Schema } = mongoose;

// Message schema definition
const GroupmessageSchema = new Schema({
  roomId: {
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
    minlength: 1,
    maxlength: 500,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

GroupmessageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

GroupmessageSchema.set('toJSON', {
  virtuals: true,
});

GroupmessageSchema.index({ timestamp: 1 });

const Message = mongoose.model('GroupMessage', GroupmessageSchema);

module.exports = Message;
