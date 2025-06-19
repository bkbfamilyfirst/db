const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate JWT Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

// Generate JWT Refresh Token
const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

// POST /auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter email and password.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store hashed refresh token in DB
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        user.refreshTokens.push(hashedRefreshToken);
        await user.save();

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
        res.status(200).json({ message: 'Logged in successfully.', accessToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// Get current user details
exports.getMe = (req, res) => {
    res.status(200).json(req.user);
};

// POST /auth/refresh-token
exports.refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Refresh token not found.' });

    const refreshToken = cookies.refreshToken;

    try {
        let foundUser = null;
        // Iterate all users and check if any of their stored refresh tokens matches the incoming one
        const allUsers = await User.find({});
        for (const user of allUsers) {
            if (user.refreshTokens && user.refreshTokens.length > 0) {
                for (const storedTokenHash of user.refreshTokens) {
                    if (await bcrypt.compare(refreshToken, storedTokenHash)) {
                        foundUser = user;
                        break; // Found matching user, break inner loop
                    }
                }
            }
            if (foundUser) break; // Found matching user, break outer loop
        }
        
        // If refresh token is not found in DB
        if (!foundUser) {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                async (err, user) => {
                    if (err) return res.status(403).json({ message: 'Invalid refresh token.' }); // Forbidden
                    // Detected refresh token reuse! Clear all refresh tokens for this user.
                    const hackedUser = await User.findById(user.id);
                    if (hackedUser) {
                        hackedUser.refreshTokens = [];
                        await hackedUser.save();
                    }
                    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
                    return res.status(403).json({ message: 'Refresh token reused, please log in again.' });
                }
            );
            return;
        }

        // Evaluate refresh token
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, user) => {
                if (err) {
                    // If token is invalid or expired, remove it from the user's array
                    const tokenIndex = await Promise.all(foundUser.refreshTokens.map(async token => await bcrypt.compare(refreshToken, token)))
                                            .then(results => results.findIndex(result => result));
                    
                    if (tokenIndex !== -1) {
                        foundUser.refreshTokens.splice(tokenIndex, 1);
                    }
                    await foundUser.save();
                    res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
                    return res.status(403).json({ message: 'Invalid refresh token.' });
                }

                // Check if the decoded user ID matches the found user ID
                if (foundUser._id.toString() !== user.id) {
                    return res.status(403).json({ message: 'Invalid refresh token for this user.' });
                }

                // Generate new tokens
                const accessToken = generateAccessToken(foundUser);
                const newRefreshToken = generateRefreshToken(foundUser);

                // Update refresh token in DB with rotation
                const oldTokenIndex = await Promise.all(foundUser.refreshTokens.map(async token => await bcrypt.compare(refreshToken, token)))
                                            .then(results => results.findIndex(result => result));
                if (oldTokenIndex !== -1) {
                    foundUser.refreshTokens.splice(oldTokenIndex, 1);
                }
                foundUser.refreshTokens.push(await bcrypt.hash(newRefreshToken, 10)); // Add new token
                await foundUser.save();

                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
                res.status(200).json({ message: 'Token refreshed successfully.', accessToken, user: { id: foundUser._id, name: foundUser.name, email: foundUser.email, role: foundUser.role } });
            }
        );

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({ message: 'Server error during token refresh.' });
    }
};

// POST /auth/logout
exports.logout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.refreshToken) return res.status(204).json({ message: 'No refresh token found.' }); // No content

    const refreshToken = cookies.refreshToken;

    try {
        let userWithMatchingToken = null;
        // Iterate all users and check if any of their stored refresh tokens matches the incoming one
        const allUsers = await User.find({});
        for (const user of allUsers) {
            if (user.refreshTokens && user.refreshTokens.length > 0) {
                for (const storedTokenHash of user.refreshTokens) {
                    if (await bcrypt.compare(refreshToken, storedTokenHash)) {
                        userWithMatchingToken = user;
                        break; // Found matching user, break inner loop
                    }
                }
            }
            if (userWithMatchingToken) break; // Found matching user, break outer loop
        }

        if (userWithMatchingToken) {
            // Remove the specific refresh token from the user's array by comparing
            const tokenIndex = await Promise.all(userWithMatchingToken.refreshTokens.map(async token => await bcrypt.compare(refreshToken, token)))
                                    .then(results => results.findIndex(result => result));
            
            if (tokenIndex !== -1) {
                userWithMatchingToken.refreshTokens.splice(tokenIndex, 1);
            }
            await userWithMatchingToken.save();
        }

        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
        res.status(204).json({ message: 'Logged out successfully.' });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Server error during logout.' });
    }
}; 