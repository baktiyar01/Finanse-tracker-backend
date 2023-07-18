const jwt = require("jsonwebtoken");
const config = require("./config/auth.config");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};
const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;
// const createTokens = (users) => {
//   const accessToken = sign(
//     { user: users.user, id: users.id },
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
//   );
//   return accessToken;
// };

// //midleware
// const validateToken = (req, res, next) => {
//   const accessToken = req.headers.authorization;
//   if (!accessToken)
//     return res.status(400).json({ error: "User not Authenticated" });

//   try {
//     const validToken = verify(
//       accessToken,
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
//     );
//     if (validToken) {
//       req.authenticated = true;
//       return next();
//     }
//   } catch (err) {
//     return res.status(400).json({ error: err });
//   }
// };

// module.exports = { createTokens, validateToken };
