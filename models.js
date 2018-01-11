'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;


const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: { type: String, required: true },
  content: { type: String },
  created: { type: Date, default: Date.now }
});


blogPostSchema.virtual('authorName').get(function () {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function () {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
};

const UserSchema = new mongoose.Schema({
  firstName: { type: String, default: ''},
  lastName: { type: String, default: ''},
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.serialize = function () {
  return {
    id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

exports.User = mongoose.model('User', UserSchema);
exports.BlogPost = mongoose.model('BlogPost', blogPostSchema);

// const User = mongoose.model('User', UserSchema);
// const BlogPost = mongoose.model('BlogPost', blogPostSchema);
// module.exports = { BlogPost, User};
