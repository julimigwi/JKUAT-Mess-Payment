const Wallet = require('../models/Wallet');

const getWalletBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        if (!wallet) return res.status(404).json({ message: 'Wallet not found' });
        res.json({ balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getWalletBalance };
