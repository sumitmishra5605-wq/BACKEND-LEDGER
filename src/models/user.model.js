const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"],  //Email Regex validation
        unique: [true, "Email already exists"]
    },

    name: {
        type: String,
        required: [true, "Name is required for creating a user"]
    },
  
    password: {
        type: String,
        required: [true, "Password is required for creating a user"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
},{
    timestamps: true
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) {  //password is not modified, so we don't need to hash it again
        return
    }
    this.password = await bcrypt.hash(this.password, 10);  //Hash the password with a salt round of 10
    return
})

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);  //Compare the provided password with the hashed password in the database
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;