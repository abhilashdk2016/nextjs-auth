import User from '../models/user';
import { hashPassword, comparePassword } from '../utils/auth';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name) {
      return res.status(400).send("Name is required");
    }

    if(!password || password.length < 6) {
      return res.status(400).send("Password is required and should be a minimum of 6 characters long");
    }

    let userExists = await User.findOne({ email }).exec();
    if(userExists) {
      return res.status(400).send("Email is taken");
    }

    const hashedPassword = await hashPassword(password);
    await new User({ name, email, password: hashedPassword}).save();
    return res.json({"ok" : true });

  } catch (error) {
    console.error(error);
    return res.status(400).send("Error. Try Again");
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(404).send("Invalid Login");
    }
    const match = await comparePassword(password, user.password);
    if(!match) {
      return res.status(400).send("Invalid Password");
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    // don't send password
    user.password = undefined;
    // send token in cookie
    res.cookie("token", token, { httpOnly: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error. Try Again");
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({message: 'Signout Successfull' });
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error. Try Again");
  }
}

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();
    return res.json({ok: true });
  } catch (err) {
    console.error(err);
    return res.status(400).send("Error. Try Again");
  }
}
