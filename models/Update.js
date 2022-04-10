const moment = require('moment');
const { Schema, Types, model } = require('mongoose');

const updateSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 240
        },
        body: {
            type: String, 
            required: true
        }
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        timestamps: true
    }
);

// Virtuals for turning the timestamps into a more readable format
updateSchema.virtual('createdAtReadable').get(function(){
    return moment(this.createdAt).format("MMMM Do YYYY");
});

updateSchema.virtual('updatedAtReadable').get(function(){
    return moment(this.updatedAt).format("MMMM Do YYYY");
});

const Update = model('Update', updateSchema);

module.exports = Update;