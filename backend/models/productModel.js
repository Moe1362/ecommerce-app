import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    size: {
      type: String,
    },
    brand: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: ObjectId,
      ref: "Category",
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
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
