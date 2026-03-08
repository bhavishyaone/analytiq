import mongoose from 'mongoose';

const funnelSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    steps: {
      type: [String],
      required: true,
      validate: {
        validator: (v) => v.length >= 2 && v.length <= 20,
        message: 'Steps must have between 2 and 20 items.',
      },
    },
    timeWindowDays: {
      type: Number,
      default: 30,
      min: 1,
      max: 365,
    },
  },
  { timestamps: true }
);

funnelSchema.index({ projectId: 1, createdAt: -1 });

export default mongoose.model('Funnel', funnelSchema);
