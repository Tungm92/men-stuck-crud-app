const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
},
  genre: { 
    type: String, 
    required: true 
},
  multiplayer: Boolean,
});

const Game = mongoose.model('Game', gameSchema)
module.exports = Game
