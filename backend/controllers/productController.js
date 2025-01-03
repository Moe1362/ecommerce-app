import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

// Create Product
const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, sizes, popular } = req.fields;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];

    // Fixed the syntax error in images array declaration
    const images = [image1, image2, image3].filter((item) => item !== undefined);

    // Validation
    switch (true) {
      case !name:
        throw new Error("Name is required");
      case !description:
        throw new Error("Description is required");
      case !price:
        throw new Error("Price is required");
      case !category:
        throw new Error("Category is required");
    }

    // Create product with images included
    const product = new Product({ 
      ...req.fields,
      images // Add the images array to the product
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message }); // Send error in object format
  }
});

// Update Product Details
const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.fields;
    // Validation
    switch (true) {
      case !name:
        throw new Error("Name is required");
      case !description:
        throw new Error("Description is required");
      case !price:
        throw new Error("Price is required");
      case !category:
        throw new Error("Category is required");
      case !quantity:
        throw new Error("Quantity is required");
      case !brand:
        throw new Error("Brand is required");
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Remove Product
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      throw new Error("Product not found");
    }
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// Fetch Products
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch Product By Id
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

// Fetch All Products
const fetchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).populate("category").sort({ createdAt: -1 });

  res.json({
    products,
    totalProducts: products.length
  });
});




// Fetch Top Products
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Fetch New Products
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.fin().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

// Filter Products
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = {
        $gte: radio[0],
        $lte: radio[1],
      };
    }
    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
