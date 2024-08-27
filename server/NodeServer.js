const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

// app inicializálás
const app = express();
// chat variációk

// middlewarek
app.use(bodyParser.urlencoded({
    extended: false
}));

// json body middleware
app.use(bodyParser.json());

// cors middleware
app.use(cors());

// static könyvtár beállítása
app.use(express.static(path.join(__dirname, 'public')));

// passport middleware
app.use(passport.initialize());
// the passport strategy
require('./config/passport')(passport);

// mongoose csatlakozás
const onlineMongoDatabaseKey = require('./config/keys').mongoURI;
mongoose.connect(onlineMongoDatabaseKey, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('[MongoDB] Az adatbázishoz való csatlakozás sikeres volt.')
}).catch(err => {
    console.log(`[MongoDB] Az adatbázishoz való csatlakozás sikertelen volt: ${err}`)
});



// routerek
const usersConst = require('./routes/api/UserCreation');
app.use('/', usersConst);

const postConst = require('./routes/api/PostCreation');
app.use('/', postConst);

const commentConst = require('./routes/api/CommentCreation');
app.use('/', commentConst);

const replyConst = require('./routes/api/ReplyCreation');
app.use('/', replyConst);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});


// kép ellenőrzés
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_TYPES') {
        res.status(422).json({ error: 'Csak kép engedélyezett.'});
    }

    if(err.code === 'LIMIT_FILE_SIZE') {
        res.status(422).json({ error: `Túl nagy fájl. A maximum nagyság 20mb.`});
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`[Viewfy] A backend elindult a(z) ${PORT}-s porton.`);
});
