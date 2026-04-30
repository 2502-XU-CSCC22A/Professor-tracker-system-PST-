import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true, lowercase: true, trim: true, minLength: 1, maxLength: 30 },
        password: { type: String, required: true, minLength: 10, maxLength: 100 }, 
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        department: { type: String, required: true, lowercase: true, trim: true }
    },
    { timestamps: true }
);

// Password hashing logic 
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    try {
        
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw error; 
    }
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);