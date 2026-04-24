import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  details: { type: Object, default: {} },
  ip: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const auditLogModel = mongoose.models.auditLog || mongoose.model("auditLog", auditLogSchema);

export default auditLogModel;
