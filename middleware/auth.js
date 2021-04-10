const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const customToken = token.length < 500;
    let decodedData;
    if (token && customToken) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decodedData.id;
    } else {
      decodedData = jwt.decode(token);
      req.userId = decodedData?.sub;
    }
    next();
  } catch (error) {
    res.send(error);
  }
};
module.exports = auth;
