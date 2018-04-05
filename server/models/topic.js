const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Topic Schema
 */
var TopicSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true
  },
  contents: {
    type: String,
    default: '',
    trim: true
  },
  comments: {
    type: Array,
    default: []
  },
  upvotes:{
type: Number,
default:0
  },
  downvotes:{
type: Number,
default:0
  }

});

/**
 * Validations
 */
TopicSchema.path('title').validate(title => title.length, 'Title cannot be blank');
mongoose.model('Topic', TopicSchema);
