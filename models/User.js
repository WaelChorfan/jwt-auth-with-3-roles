'use strict';
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var personSchema = mongoose.Schema({
		username: String,
        password: String,
        role:String

});


module.exports = mongoose.model('User', personSchema);