const moment = require('moment');
const { Schema, Types, model} = require('mongoose');

// Being a bit anal here, but in the interests of potentially expanding tag functionality in the future
// TODO: consider how to approach this
const tagSchema = new Schema(
    {
        // For now, we're just gonna allow these three options--might change this up later
        tagName: {
            type: String,
            required: true,
            // For no
            enum: ["2D", "3D", "other"]
        }
    },
    {
        // No ids necessary for these, since they're strictly subdocs
        id: false
    }
);

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
        typeTags: [tagSchema],
    },
    {
        // Just in case we want to use virtuals and getters
        // TODO: turn off virtuals if we end up not using it
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

module.exports = Artwork;