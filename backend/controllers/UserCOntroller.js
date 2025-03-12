const User = require('../models/User');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) });
};

module.exports = { loginUser };
