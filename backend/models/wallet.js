// const mongoose = require("mongoose");

// const WalletSchema = new mongoose.Schema({
//     phone: { type: String, required: true, unique: true },
//     balance: { type: Number, required: true, default: 0 }
// });

// const Wallet = mongoose.model("Wallet", WalletSchema);
// module.exports = Wallet;
const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
});

module.exports = mongoose.model('Wallet', walletSchema);
