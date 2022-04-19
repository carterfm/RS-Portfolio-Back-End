const router = require('express').Router();
const { User, Update } = require('../../models');

// Test route
router.get('/', (req, res) => {
    Update.find()
        .select('-__v')
        .then(updates => res.status(200).json(updates))
        .catch((err) => res.status(500).json(err));
});

router.get('/')

router.post('/', (req, res) => {
    // So, the req.body should include: title (string), body (string), userId (string id)
    // First, we check to make sure a corresponding user exists, since we don't want an update to be posted if it's not associated with anyone
    User.findById(req.body.userId)
        .then(foundUser => {
            if (!foundUser) {
                return res.status(404).json({ message: "Unable to post update: no user with given ID found"})
            }

            Update.create({title: req.body.title, body: req.body.body, user: req.body.userId})
                .then(newUpdate => {
                    return User.findByIdAndUpdate(req.body.userId, {$push: {updates: newUpdate._id}}, {new: true})
                })
                .then(updatedUser => {
                    !updatedUser
                    // This isn't an eventuality we should ever see, but I'm leaving it in just in case
                    ? res.status(404).json({ message: "Update created, but found no user with that ID"})
                    : res.status(200).json(updatedUser);
                })
                .catch((err) => res.status(500).json(err))
        })
        .catch((err) => res.status(500).json(err))
});

router.put('/:updateId', (req, res) => {
    Update.findByIdAndUpdate(req.params.updateId, {title: req.body.title, body: req.body.body }, {new: true})
        .then(update => {
            !update
            ? res.status(404).json({ message: "Found no update with that ID"})
            : res.status(200).json(update);
        })
        .catch((err) => res.status(500).json(err))
});

router.delete('/:updateId', (req, res) => {
    Update.findByIdAndDelete(req.params.updateId)
        .then(deletedUpdate => {
            if (!deletedUpdate) {
                return res.status(404).json({ message: "Found no update with that ID"})
            }

            User.findByIdAndUpdate(deletedUpdate.user, {$pull: {updates: deletedUpdate._id}}, {new: true})
                .then(updatedUser => {
                    !updatedUser
                    // This isn't an eventuality we should ever see, but I'm leaving it in just in case
                    ? res.status(404).json({ message: "Update deleted, but found no user with that ID"})
                    : res.status(200).json(updatedUser);
                })
                .catch((err) => res.status(500).json(err))
        })
        .catch((err) => res.status(500).json(err))
});

module.exports = router;