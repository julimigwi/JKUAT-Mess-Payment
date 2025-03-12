const axios = require("axios");
const getAccessToken = require("../utils/mpesaAuth");
require("dotenv").config();
const Wallet = require("../models/wallet");

const stkPush = async (phone, amount) => {
    try {
        const token = await getAccessToken();
        const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, "").slice(0, 14);
        const password = Buffer.from(`${process.env.BUSINESS_SHORTCODE}${process.env.PASSKEY}${timestamp}`).toString("base64");

        const response = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            BusinessShortCode: process.env.BUSINESS_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: process.env.BUSINESS_SHORTCODE,
            PhoneNumber: phone,
            CallBackURL: process.env.CALLBACK_URL,
            AccountReference: "JKUAT Mess",
            TransactionDesc: "Meal Wallet Deposit"
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.ResponseCode === "0") {
            // STK Push Sent Successfully - Update Wallet
            const wallet = await Wallet.findOne({ phone });
            if (wallet) {
                wallet.balance += amount;
                await wallet.save();
            } else {
                await Wallet.create({ phone, balance: amount });
            }
        }

        return response.data;
    } catch (error) {
        console.error("STK Push Error:", error.response?.data || error.message);
        throw new Error("Failed to initiate STK Push");
    }
};

module.exports = stkPush;
