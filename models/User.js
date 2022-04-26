const { Schema, Types, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
            type: String,
            default: ""
        },
        portrait: {
            type: String,
            default: ""
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

// Hook for creation of a document--hashes our password when we create it
userSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    
    next();
});

userSchema.pre('findOneAndUpdate', function(next) {
    console.log(this._update);
    if (this._update.password) {
        console.log("password change detected");
        this._update.password = bcrypt.hashSync(this._update.password, 10);
    }
    next();
});

userSchema.virtual('updateCount').get(function(){
    return this.updates.length;
})

userSchema.virtual('artworkCount').get(function(){
    return this.artwork.length;
});

const User = model('User', userSchema);

// TODO: erase or update once done with preliminary testing
// User.deleteMany({}, err => (err ? console.log(err) : console.log('User collection cleared--ready for seeding')));
User.find()
.then(data => {
    if (data.length === 0) {
        console.log("Seeding user collection...");
        User.create({username: "RSpinazzola", email: "rhysspinazzola@gmail.com", password: "R0s3_buDdy", portrait: ""})
            .then(console.log("Created new document!"))
            .catch(err => console.log(err));
    } else {
        console.log("User already seeded");
    }
});

module.exports = User;