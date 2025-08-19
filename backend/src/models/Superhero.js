import mongoose from 'mongoose';

const stringField = (msg) => ({
  type: String,
  required: [true, msg],
  trim: true,
});

const imageSubSchema = new mongoose.Schema(
  {
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    filename: { type: String, required: true, trim: true },
    contentType: { type: String, required: true, trim: true },
    uploadDate: { type: Date, default: Date.now },
  },
  { _id: false },
);

const superheroSchema = new mongoose.Schema(
  {
    nickname: stringField('Nickname is required'),
    real_name: stringField('Real name is required'),
    origin_description: stringField('Origin description is required'),
    superpowers: stringField('Superpowers are required'),
    catch_phrase: stringField('Catch phrase is required'),
    images: { type: [imageSubSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

superheroSchema.virtual('id').get(function getVirtualId() {
  return this._id.toHexString();
});

superheroSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    const result = { ...ret };
    delete result._id;
    delete result.__v;
    return result;
  },
});

export default mongoose.model('Superhero', superheroSchema);
