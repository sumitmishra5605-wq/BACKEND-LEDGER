const mongoose = require("mongoose");


const transactionSchema = new mongoose.Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must have a from account"],
        index: true  //Speeding up after searching
    },

    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Transaction must be associated to account"],
        index: true  //Speeding up after searching
    },

    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message: "Status must be either PENDING, COMPLETED, FAILED or REVERSED",
        },
        default: "PENDING"
    },

    amount: {
        type: Number,
        required: [true, "Transaction must have an amount"],
        min: [0, "Amount must be a positive number"]
    },

    idempotencyKey: {
        type: String,
        required: [true, "Idempotency key is required for creating a transaction"],
        unique: true,
        index: true
    }
}, {
    timestamps: true

})

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;