import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";
import { Trash2, Upload, Plus } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL"]; 
const COLORS = ["Black", "White", "Red", "Blue", "Green"];

const ProductList = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();

  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !description || !price || !category || !brand) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      const productData = new FormData();
      
      // Append text fields
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      
      // Append optional fields
      if (selectedSize) productData.append("size", selectedSize);
      if (selectedColor) productData.append("color", selectedColor);

      // Append multiple images
      images.forEach((image) => {
        productData.append('images', image);
      });

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed");
      } else {
        toast.success(`${data.name} created successfully`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed");
    }
  };

  const uploadFileHandler = async (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Validate file types and limit
    const validImageFiles = newFiles.filter(file => 
      ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (validImageFiles.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    try {
      // Optional: Pre-upload validation and processing
      const uploadPromises = validImageFiles.map(async (file) => {
        // Optional: Additional file processing or validation
        const img = await createImageBitmap(file);
        
        // Optional: Resize or compress image
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        return new Promise((resolve) => {
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          }, file.type);
        });
      });

      const processedFiles = await Promise.all(uploadPromises);
      
      setImages(prevImages => [...prevImages, ...processedFiles]);
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Image processing failed");
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="min-h-screen mr-[20rem]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <AdminMenu />
          </div>

          <div className="lg:w-3/4">
            <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="border-b border-gray-700 pb-6">
                <h1 className="text-3xl font-bold text-white">
                  Create New Product
                </h1>
                <p className="text-gray-400 mt-2">
                  Fill in the information below to create a new product
                </p>
              </div>

              <div className="py-6">
                {/* Multiple Image Upload Section */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Product Images (Max 5)
                  </label>
                  <div className="grid grid-cols-5 gap-4">
                    {/* Image Upload Placeholder */}
                    {images.length < 5 && (
                      <motion.div 
                        onClick={() => fileInputRef.current.click()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="border-2 border-dashed border-gray-700 rounded-lg p-4 
                        flex flex-col items-center justify-center cursor-pointer 
                        hover:border-pink-500 transition-colors duration-300 
                        aspect-square"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-400 text-xs text-center">
                          Add Image
                        </span>
                      </motion.div>
                    )}

                    {/* Uploaded Images */}
                    {images.map((image, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative group"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`product-${index}`}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white 
                          p-1 rounded-full opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={uploadFileHandler}
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info Section */}
                <div className="bg-gray-900 p-6 rounded-xl space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Basic Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-400">$</span>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                          placeholder="0.00"
                          required
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter brand name"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories?.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Size
                      </label>
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Size</option>
                        {SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Color
                      </label>
                      <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Color</option>
                        {COLORS.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inventory Section */}
                <div className="bg-gray-900 p-6 rounded-xl space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Inventory
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quantity */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter quantity"
                        min="0"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter stock amount"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="bg-gray-900 p-6 rounded-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Description
                  </h2>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-pink-700 focus:ring-4 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;