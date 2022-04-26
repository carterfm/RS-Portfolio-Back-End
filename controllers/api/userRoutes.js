const router = require('express').Router();
const { User, Artwork, Update } = require('../../models');

// Basic route for getting all users' data
router.get('/', (req, res) => {
    User.find()
        .select('-__v')
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err));
});

// Route for getting a single user by their id
router.get('/:userId', (req, res) => {
    User.findById(req.params.userId)
        .select('-__v')
        .populate({ path: 'updates', select: '-__v'})
        .populate({ path: 'artwork', select: '-__v'})
        .then(user => {
            !user
            ? res.status(404).json( { message: 'No user with that ID'})
            : res.status(200).json(user)
        })
        .catch(err => res.status(500).json(err));
});

// Post route for creating a new user
// This has no reason to exist, given the site we're going for; I just wanted to test posting out a bit
// router.post('/', (req, res) => {
//     User.create(req.body)
//         .then(newUser => res.json(newUser))
//         .catch(err => res.status(500).json(err));
// });

// TODO: write a login post route

// Put route for editing login-connected information
// May be somewhat redundant, but I want there to be security here
router.put('/:userId', (req, res) => {
    User.findByIdAndUpdate( req.params.userId, {username: req.body.username, email: req.body.email, password: req.body.password}, {validators: true, new: true})
        .then(updatedUser => {
            !updatedUser
            ? res.status(404).json( { message: 'No user with that ID'})
            : res.status(200).json(updatedUser)
        })
        .catch(err => res.status(500).json(err));
});

// Route for editing bio and portrait
router.put('/bio/:userId', (req, res) => {
    User.findByIdAndUpdate( req.params.userId, {bio: req.body.bio, portrait: req.body.portrait}, {new: true})
        .then(updatedUser => {
            !updatedUser
            ? res.status(404).json( { message: 'Cannot edit bio -- no user with that ID'})
            : res.status(200).json(updatedUser)
        })
        .catch(err => res.status(500).json(err));
});



module.exports = router;