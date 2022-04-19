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
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
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

// Update.deleteMany({}, err => (err ? console.log(err) : console.log('Update collection cleared--ready for seeding')));

module.exports = Update;