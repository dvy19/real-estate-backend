const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    try {
        let token;


        console.log("Authorization:", req.headers.authorization);
        console.log("Cookies:", req.cookies);

        // 1. Check Authorization header (React Native)
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        // 2. If no header token, check cookie (React Web)
        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        // 3. No token
        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // 4. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED:", decoded);

        // 5. Attach user
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;