// Note:
// title of the note
// content of the note
// timestamp of creation

import mongoose from 'mongoose'; 
import uuid from 'uuid/v4';// ES6
// const mongoose = require('mongoose'); // Common JS

const treeSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
  genus: {
    type: String,
    required: true,
    minlength: 10,
  },
  height: {
    type: String,
    required: false,
    minlength: 1,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
});

// Vinicio Mongoose wants to create a model out of a Schema
export default mongoose.model('tree', treeSchema);
