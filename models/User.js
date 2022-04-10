const { Schema, Types, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true, // automatically trims input
            minLength: 4,
            maxLength: 80
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function(value) {
                    // A regex validator that checks for an email
                    return /^([a-zA-Z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value);
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 32
        },
        bio: {
            type: String
        },
        updates: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Update'
            }
        ],
        artwork: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Artwork'
            }
        ]

    },
    {
        // Just in case we want to use virtuals and getters
        // TODO: turn off virtuals if we end up not using it
        toJSON: {
            virtuals: true,
            getters: true
        }, 
        timestamps: false
    }
);

userSchema.virtual('updateCount').get(function(){
    return this.updates.length;
})

userSchema.virtual('artworkCount').get(function(){
    return this.artwork.length;
});

const User = model('User', userSchema);

// TODO: erase or update once done with preliminary testing
User.find()
.then(data => {
    if (data.length === 0) {
        console.log("Seeding...");
        User.create({username: "carterfm", email: "carterf.morfitt@gmail.com", password: "testpassword", bio: "I'm honestly just trying my best to hang on, here."},
        err => (err ? console.log(err) : console.log('Created new document')));
    } else {
        console.log("Already seeded");
    }
});

module.exports = User;