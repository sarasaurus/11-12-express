'use strict';

import mongoose from 'mongoose'; 

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
  // timestamp: {
  //   type: Date,
  //   default: () => new Date(),
  // },
});

export default mongoose.model('tree', treeSchema);
