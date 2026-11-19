const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailService = require('../services/email.service');

/**
 * User Registration Controller
 * POST /api/auth/register
 */
async function UserRegisterController(req, res) {
    const { email, password, name } = req.body

    const isExists = await userModel.findOne({ 
        email: email
    });

    if (isExists) {
        return res.status(422).json({ 
            message: "User already exists",
            status: false
        });
    }

    const user = await userModel.create({
        email, password, name
    });

    try {
        await emailService.sendRegistrationEmail(user.email, user.name);
        console.log("Welcome email sent successfully");
        } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        }
          
    const token = jwt.sign({userId: user._id}, process.env.Jwt_Secret, {
        expiresIn: '3d'})

    res.cookie("token", token)
    
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });
}

/**
 * User Login Controller
 * POST /api/auth/login
 */
async function UserLoginController(req, res) {
    const {email, password} = req.body; 

    const user = await userModel.findOne({ email }).select('+password');  //Select the password field explicitly since it is set to select: false in the schema

    if(!user) {
        return res.status(404).json({
            message: "User not found",
            status: false
        });
    }

    const isMatch = await user.comparePassword(password);
       
    if(!isMatch) {
        return res.status(401).json({
            message: "Invalid credentials",
            status: false
        });
    }

    const token = jwt.sign({userId: user._id}, process.env.Jwt_Secret, {
        expiresIn: '3d'
    });

    res.cookie("token", token);

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token
    });

    await emailService.sendRegistrationEmail(user.email, user.name);
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function UserLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

module.exports = {
    UserRegisterController,
    UserLoginController,
    UserLogoutController
}