const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Response = require("../middlewares/responseHandler");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return Response.error(res, "Email already registered", 400);

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role: "user",
      is_active: false,
    });

    return Response.success(res, "Register success", {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      is_active: newUser.is_active,
    });

  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return Response.error(res, "User not found", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return Response.error(res, "Wrong password", 400);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return Response.success(res, "Login success", {
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });

  } catch (err) {
    return Response.error(res, err.message, 500);
  }
};
