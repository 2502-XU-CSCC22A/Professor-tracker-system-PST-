import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js"

const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, department, firstName, lastName } = req.body;

    if (!username || !email || !password || !department || !firstName || !lastName) {
      return res.status(400).json({ message: "Empty field detected" });
    }

    const lowerUsername = username.toLowerCase();
    const lowerEmail = email.toLowerCase();

    const existing = await User.findOne({
      $or: [{ email: lowerEmail }, { username: lowerUsername }]
    });

    
    if (existing) {
      if (existing.username === lowerUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
      if (existing.email === lowerEmail) {
        return res.status(409).json({ message: "Email already taken" });
      }

      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({
      username: lowerUsername,
      email: lowerEmail,
      password,
      department,
      firstName: titleCase(firstName),
      lastName: titleCase(lastName),
      status: "ON"
    });

    await user.save();

    return res.status(201).json({
      message: "User Registered",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        department: user.department,
        status: user.status
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation Error",
        error: error.message
      });
    }

    // Extra Safety
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      if (field === "username") {
        return res.status(409).json({ message: "Username already taken" });
      }

      if (field === "email") {
        return res.status(409).json({ message: "Email already taken" });
      }

      return res.status(409).json({ message: "Duplicate field error" });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
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
        status: user.status
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
    try {
        const users = await User.find().select("-password"); // Hide passwords for safety
        res.status(200).json(users); 
    } catch (error) {
        res.status(500).json({ message: "Server error fetching users" });
    }
}

const  updateUser = async (req, res) => {
    try {
        if(Object.keys(req.body).length ===0){
            return res.status(400).json({
                message: "No data provided"
            });
        }
        
        const updateData = { ...req.body };
        if (updateData.firstName) {
          updateData.firstName = titleCase(updateData.firstName);
        }
        if (updateData.lastName) {
          updateData.lastName = titleCase(updateData.lastName);
        }
        
        const user = await User.findByIdAndUpdate(req.params.id, updateData,{new: true});
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

const getProfessorsByDepartment = async (req, res) => {
  try {
    const { department } = req.params;

    const professors = await User.find({
      department: department.toLowerCase(),
    }).select("firstName lastName username department");

    res.status(200).json(professors);
  } catch (error) {
    res.status(500).json({ message: "SERVER ERROR" });
  }
};
export{
    registerUser,
    loginUser,
    logoutUser,
    getUsers,
    updateUser,
    deleteUser,
    getProfessorsByDepartment
};
