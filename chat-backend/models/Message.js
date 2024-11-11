const mongoose = require('mongoose');
const { Schema } = mongoose;

// Message schema definition
const messageSchema = new Schema({
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
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Add a virtual 'id' field to return _id as 'id'
messageSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure the virtual field 'id' is included when converting to JSON
messageSchema.set('toJSON', {
  virtuals: true,
});

// Create an index on timestamp for efficient querying by message time
messageSchema.index({ timestamp: 1 });

// Compile the Message model from the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
