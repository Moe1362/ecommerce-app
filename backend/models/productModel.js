import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: [{
      type: String,
      required: true,
    }],
    size: {
      type: Array,
    },
    category: {
      type: ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },
    popular: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
