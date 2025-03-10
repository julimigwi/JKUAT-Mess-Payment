const mongoose = require("mongoose");

const WalletSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 }
});

const Wallet = mongoose.model("Wallet", WalletSchema);
module.exports = Wallet;
