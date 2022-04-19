const router = require('express').Router();
const { User, Artwork } = require('../../models');

// TODO: add authentication to these routes, once you've worked out how that's done 
// TODO: 
// Basic get routes for getting all artwork--only used for testing purposes, hence its being commented out
// router.get('/', (req, res) => {
//     Artwork.find()
//     .select('-__v')
//     .then(artwork => res.status(200).json(artwork))
//     .catch((err) => res.status(500).json(err));
// });

// Route for getting a single artwork
router.get('/:artworkId', (req, res) => {
    Artwork.findById(req.params.artworkId)
        .select('-__v')
        .then( artwork => {
            !artwork
            ? res.status(404).json({message: "No artwork with that ID"})
            : res.status(200).json(artwork)
        })
        .catch((err) => res.status(500).json(err));
});

// Route for posting an artwork
router.post('/', (req, res) => {
    // So, here's what req.body should include:
    // title: the title of the artwork
    // description: a description of the artwork
    // imageLink: a link to the image of the artwork. We'll handle hosting via Cloudinary
    // typeTag: a string containing the name of the applicable type tag
    // userId: the id of the user this is to be associated with
    // First, we'll check to make sure the specified user exists. If not, we'll display an error message--don't want there to be artworks floating
    User.findById(req.body.userId)
        .then(foundUser => {
            if (!foundUser) {
                return res.status(404).json({ message: "Unable to post artwork: no user with given ID found"})
            }

            Artwork.create(        {
                title: req.body.title,
                description: req.body.description,
                imageLink: req.body.imageLink,
                typeTag: req.body.typeTag,
                user: req.body.userId
            })
                .then(newArtWork => {
                    return User.findByIdAndUpdate(req.body.userId, { $push: { artwork: newArtWork._id}}, {new: true})
                })
                .then(updatedUser => {
                    !updatedUser
                    // This isn't an eventuality we should ever see, but I'm leaving it in just in case
                    ? res.status(404).json({ message: "Artwork created, but found no user with that ID"})
                    : res.status(200).json(updatedUser);
                })
                .catch((err) => res.status(500).json(err))
        })
        .catch(err => res.status(500).json(err));

});

router.put('/:artworkId', (req, res) => {
    Artwork.findByIdAndUpdate(req.params.artworkId, {title: req.body.title, description: req.body.description, imageLink: req.body.imageLink, typeTag: req.body.typeTag }, { new: true })
    .then( artwork => {
        !artwork
        ? res.status(404).json({message: "No artwork with that ID"})
        : res.status(200).json(artwork)
    })
    .catch((err) => res.status(500).json(err));
});

// Route for deleting an artwork
router.delete('/:artworkId', (req, res) => {
    Artwork.findByIdAndDelete(req.params.artworkId)
        .then(deletedArtwork => {
            if(!deletedArtwork) {
                return res.status(404).json({ message: "No artwork with that Id found"})
            }

            User.findByIdAndUpdate(deletedArtwork.user, { $pull: { artwork: req.params.artworkId } }, { new: true })
                .then(updatedUser => {
                    !updatedUser
                    ? res.status(404).json({ message: "Artwork deleted, but found no user associated with it"})
                    : res.status(200).json(updatedUser);
                })
                .catch((err) => res.status(500).json(err))
        })
        .catch((err) => res.status(500).json(err));
});

module.exports = router;