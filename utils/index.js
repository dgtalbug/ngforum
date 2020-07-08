const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const getAuthUser = (req) => {
  const tokenWithBearer = req.headers.authorization || " ";
  const token = tokenWithBearer.split(" ")[1];
  if (!token) {
    return null;
  }
  try {
    // console.log(token);
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    // console.log("err" + error);
    return null;
  }
};

module.exports = { generateToken, getAuthUser };
