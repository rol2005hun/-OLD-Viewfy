const router = require('express').Router();
const User = require('../../model/User');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../../validation/validation');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {followUserValidation} = require('../../validation/validation');
const key = require('../../config/keys').secret;
const multer = require('multer');

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if(!allowedTypes.includes(file.mimetype)) {
        const error = new Error('Nem támogatott fájltípus.');
        error.code = 'LIMIT_FILE_TYPES';
        return cb(error, false);
    }
    cb(null, true);
}

const MAX_SIZE = 20000000;
const storage = multer.diskStorage(
    {
        destination: 'client/src/images/',
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
        limits: {
            fileSize: MAX_SIZE
        }
    }
);

const upload = multer({storage: storage});
router.route('/upload').post(upload.single('file'), post);
function post(request, response) {
    response.json({
        message: 'Sikeres fájlfeltöltés.'
    });
}


// összes felhasználó lekérése
router.get('/user', async (req, res) => {
    const users = await User.find();
    return res.json({
        users: users
    });
})

// összes lekérése
router.get('/explorable-users/username/:username', async (req, res) => {
    const users = await User.find({username: {$ne: req.params.username}});
    return res.json({
        users: users
    });
})

// felhasználónév szerinti lekérés
router.get('/user/username/:username', async (req, res) => {
    const users = await User.find({username: req.params.username});
    return res.json({
        users: users
    });
})

// követés frissítés
router.patch('/follow/user-id/:id', async (req, res) => {
    try {
        const userToFollow = await User.findOne({_id: req.params.id});
        const userFollowing = await User.findOne({username: req.body.username});

        if (userToFollow.username === userFollowing.username) {
            return res.status(404).json({
                success: false,
                msg: `A felhasználók nem követhetik saját magukat.`
            })
        }

        if (!userToFollow.followers.includes(req.body.username) && !userFollowing.following.includes(userToFollow.username)) {
            userToFollow.followers.push(req.body.username);
            userFollowing.following.push(userToFollow.username);
            await userToFollow.save();
            await userFollowing.save();
        } else {
            return res.status(404).json({
                success: false,
                msg: `${userFollowing.username} már követi ${userToFollow.username}-t.`
            });
        }


        return res.json({
            status: 'Sikeres követés.'
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// felhasználó frissítés
router.patch('/user/user-id/:id', async (req, res) => {
    try {
        const user = await User.updateOne({_id: req.params.id}, {$set: req.body});
        return res.json({
            status: 'Sikeres frissítés.'
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
});

// kikövetés frissítés
router.patch('/unfollow/user-id/:id', async (req, res) => {
    try {
        const userToUnfollow = await User.findOne({_id: req.params.id});
        const userUnfollowing = await User.findOne({username: req.body.username});

        if (userToUnfollow.username === userUnfollowing.username) {
            return res.status(404).json({
                success: false,
                msg: `A felhasználók nem követhetik saját magukat.`
            })
        }

        const indexY = userUnfollowing.following.indexOf(userToUnfollow.username);
        if (indexY > -1) {
            userUnfollowing.following.splice(indexY, 1);
            await userUnfollowing.save();
        }

        const indexX = userToUnfollow.followers.indexOf(userUnfollowing.username);
        if (indexX > -1) {
            userToUnfollow.followers.splice(indexX, 1);
            await userToUnfollow.save();
        }

        return res.json({
            status: 'Sikeres kikövetés.',
        });
    } catch (err) {
        res.status(404).send(err.message);
    }
})

// regisztráció
router.post('/register', async (req, res) => {
    const {error} = registerValidation(req.body);
    if (error) {
        return res.status(404).json({
            success: false,
            msg: 'Your ' + error.details[0].message
        });
    }

    const isUsernameTaken = await User.findOne({username: req.body.username});
    const isEmailTaken = await User.findOne({email: req.body.email});

    if (isUsernameTaken || isEmailTaken) {
        return res.status(404).json({
            success: false,
            msg: 'A megadott felhasználónév vagy email cím már regisztrálva van.'
        });
    }

    if (req.body.password !== req.body.confirm_password) {
        return res.status(404).json({
            success: false,
            msg: 'A megadott jelszavak nem egyeznek.'
        });
    }

    // hash jelszó
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        confirm_password: req.body.password,
        image: req.body.image
    });
    try {
        const savedUser = await newUser.save();
        newUser.save().then(user => {
            return res.status(201).json({
                success: true,
                msg: 'Sikeres regisztráció.'
            });
        });
    } catch (err) {
        res.status(404).send(err);
    }
});


/**
 * @route POST /login
 * @desc Signing in the User
 * @access Public
 */

// bejelentkezés
router.post('/login', async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) {
        return res.status(404).json({
            success: false,
            msg: error.details[0].message
        });
    }

    // létezik-e az email
    const user = await User.findOne({username: req.body.username});

    if (!user) {
        return res.status(404).json({
            success: false,
            msg: 'A megadott felhasználónév nem létezik.'
        });
    }

    // ha a jelszó érvényes
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (validPassword) {
        const payload = {
            _id: user._id,
            username: user.username,
            name: user.name,
            email: user.email
        }
        jwt.sign(payload, key, {
            expiresIn: 604800
        }, (err, token) => {
            res.status(200).json({
                success: true,
                user: user,
                token: `Bearer ${token}`,
                msg: 'Sikeres bejelentkezés.'
            });
        })
    } else {
        return res.status(404).json({
            success: false,
            msg: 'A megadott jelszó érvénytelen.'
        });
    }
})

/**
 * @route POST /profile
 * @desc A felhasználó adatait adja vissza
 * @access Public
 */

// profil
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    return res.json({
        user: req.user
    });
});

module.exports = router;