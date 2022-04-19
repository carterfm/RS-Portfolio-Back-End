const moment = require('moment');
const { Schema, Types, model} = require('mongoose');

const artworkSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 240
        },
        description: {
            type: String,
            required: false
        },
        // We'll be using Cloudinary for image hosting and embedding and whatnot, and I assume they'll give us a URL, so we'll just go ahead and use that
        imageLink: {
            type: String,
            required: true
        },
        typeTag: {
            type: String,
            required: true,
            // For no
            enum: ["2D", "3D", "Other"]
        },
        // username of person who posted this artwork
        // TODO: change this to a foreign key
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        // Just in case we want to use virtuals and getters
        toJSON: {
            virtuals: true,
            getters: true
        }, 
        timestamps: true
    }
);

// Virtuals for turning the timestamps into a more readable format
artworkSchema.virtual('createdAtReadable').get(function(){
    return moment(this.createdAt).format("MMMM Do YYYY");
});

artworkSchema.virtual('updatedAtReadable').get(function(){
    return moment(this.updatedAt).format("MMMM Do YYYY");
})

// Initializing Artwork model using the schema we just wrote up
const Artwork = model('Artwork', artworkSchema);

// Artwork.deleteMany({}, err => (err ? console.log(err) : console.log('Artwork collection cleared')));

module.exports = Artwork;