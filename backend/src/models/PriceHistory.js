import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema(
  {
    productKey: { type: String, required: true, index: true },
    provider: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    available: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

priceHistorySchema.index({ productKey: 1, timestamp: -1 });
priceHistorySchema.index({ productKey: 1, provider: 1, timestamp: -1 });

export const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
