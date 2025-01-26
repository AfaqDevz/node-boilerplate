import mongoose from "mongoose";
const { Schema } = mongoose;

const guarantorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    location: { type: String, required: true },
    cnic: { type: String, required: true },
});

const loanSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cnic: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    loanAmount: { type: String, required: true },
    monthlyPayment: { type: String, required: true },
    initialDeposit: { type: Number, required: true },
    loanPeriod: { type: Number, required: true },
    guarantor1: { type: guarantorSchema, required: true },
    guarantor2: { type: guarantorSchema, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
})

const Loan = mongoose.model('Loan', loanSchema);
export default Loan