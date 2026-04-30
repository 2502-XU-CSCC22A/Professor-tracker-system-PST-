import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"

const registerUser = async (req, res) => {
    try {
        const {username, email, password, department, firstName, lastName}= req.body;

        if(!username || !email || !password || !department || !firstName || !lastName){
            return res.status(400).json({message: "empty field detected"})
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if(existing){
            return res.status(400).json({message: "user exist"});
        }

        const user = await User.create({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
            department,
            firstName,
            lastName,
        });

        res.status(201).json({
            message: "User Registered",
            user: {id: user._id, email: user.email, username: user.username, firstName: user.firstName, lastName: user.lastName, department: user.department}
        });
    } catch (error) {
        res.status(500).json({message: "error server", error: error.message });
    }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username and password"
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase()
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials"
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

    res.status(200).json({
      message: "user Login",
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

const logoutUser = async (req, res) => {
    try { 
        const { username } = req.body;

        const user = await User.findOne({
            username: username.toLowerCase()
        });
        if(!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "Logout Successful"
        });
    } catch(error) {
        res.status(500).json({
            message: "Server error", error
        });

    }
}

const getUsers = async (req, res) => {
    try{
        const users = await User.find();
         res.status(200).json(users);
    } catch(error){
        res.status(500).json({
            message: "Server error", error
        });
    }
}

const  updateUser = async (req, res) => {
    try {
        if(Object.keys(req.body).length ===0){
            return res.status(400).json({
                message: "No data provided"
            });
        }
        
        const user = await User.findByIdAndUpdate(req.params.id, req.body,{new: true});
          if(!user){
            return res.status(404).json({
            message: "user not found"
            });
        } 

        res.status(200).json({
            message: "user updated successful", user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}


const deleteUser = async (req, res) => {
    try {
        const userdeleted = await User.findByIdAndDelete(req.params.id);
        if (!userdeleted){
            return res.status(400).json({
                message: "user not found"
            });
        }

        res.status(200).json({
            message: "user deleted succesfull"
        });
    } catch (error) {
         res.status(500).json({
            message: "SERVER ERROR"
        });
    }
}
export{
    registerUser,
    loginUser,
    logoutUser,
    getUsers,
    updateUser,
    deleteUser
};
