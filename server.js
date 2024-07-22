const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const path = require('path');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected on MongoDB ${mongoose.connection.name}.`)
})

const Game = require('./models/game.js')

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', async (req, res) => {
    res.render('index.ejs')
});

app.get('/games', async (req, res) => {
    const allGames = await Game.find();
    res.render('games/index.ejs', { games: allGames});
});

app.get('/games/new', async (req, res) => {
    res.render('games/new.ejs')
});

app.post("/games", async (req, res) => {
    if (req.body.multiplayer === 'on') {
        req.body.multiplayer = true;
    } else {
        req.body.multiplayer = false;
    };
    await Game.create(req.body)
    res.redirect('/games');
});

app.get ('/games/:gameId', async (req, res) => {
    const foundGame = await Game.findById(req.params.gameId);
    res.render('games/show.ejs', { game: foundGame});
});

app.delete('/games/:gameId', async (req, res) => {
    await Game.findByIdAndDelete(req.params.gameId)
    res.redirect('/games')
})

app.get('/games/:gameId/edit', async (req, res) => {
    const foundGame = await Game.findById(req.params.gameId)
    res.render('games/edit.ejs', { 
        game: foundGame})
})

app.put('/games/:gameId', async (req, res) => {
    if (req.body.multiplayer === 'on') {
        req.body.multiplayer = true;
    } else {
        req.body.multiplayer = false;
    };

    await Game.findByIdAndUpdate(req.params.gameId, req.body);
    res.redirect(`/games/${req.params.gameId}`);
});

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});