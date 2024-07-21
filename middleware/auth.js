import jwt from "jsonwebtoken";
// Created to verify that user has proper authorization before initating the later functions in that route & will be used usually when a route is called for post , use , etc.
// e.g. app.post("/auth/register" , upload.single("picture") , register); 
// Here we can put verifyToken as :
// app.post("/auth/register", verifyToken , upload.single("picture") , register); This will first verify that the jsonwebtoken is authorized before uploading the picture and registering it 
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();// passes control over to the next middleware as it is usually present in the middle of post , get , etc.
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
