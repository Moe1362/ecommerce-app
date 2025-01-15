import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import AdminMenu from "./AdminMenu.jsx";
import { Trash2, Upload } from "lucide-react";

const SIZES = ["XS", "S", "M", "L", "XL"]; 
const COLORS = ["Black", "White", "Red", "Blue", "Green"];

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: formData } = useGetProductByIdQuery(params.id);

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Initialize form data when product data is loaded
  useEffect(() => {
    if (formData && formData._id) {
      // Initialize images from existing product images
      setImages(formData.images || []);
      setName(formData.name || "");
      setDescription(formData.description || "");
      setPrice(formData.price || "");
      setCategory(formData.category || "");
      setStock(formData.countInStock || 0);
      setColor(formData.color || "");
      setSize(formData.size || "");
    }
  }, [formData]);

  // File upload handler for multiple images
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
      // Optional: Pre-upload processing
      const processedFiles = await Promise.all(
        validImageFiles.map(async (file) => {
          const img = await createImageBitmap(file);
          
          // Optional: Resize image
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

          return new Promise((resolve) => {
            canvas.toBlob((blob) => {
              resolve(new File([blob], file.name, { type: file.type }));
            }, file.type);
          });
        })
      );

      setImages(prevImages => [...prevImages, ...processedFiles]);
    } catch (error) {
      console.error("Image processing error:", error);
      toast.error("Image processing failed");
    }
  };

  // Remove image from the list
  const removeImage = (indexToRemove) => {
    setImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validation
    if (!name || !description || !price || !category) {
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
      productData.append("countInStock", stock);
      
      // Append optional fields
      if (color) productData.append("color", color);
      if (size) productData.append("size", size);
  
      // Append multiple images
      images.forEach((image) => {
        // Check if image is a string (existing image URL) or a File object
        if (typeof image === 'string') {
          productData.append('existingImages', image);
        } else {
          productData.append('images', image);
        }
      });
  
      // Log the content of FormData for debugging
      for (let [key, value] of productData.entries()) {
        console.log(`${key}: `, value);
      }
  
      const result = await updateProduct({
        productId: params.id,
        productData
      }).unwrap();
  
      if (result._id) {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
        console.log("Updated product:", result);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Full error:", error);
      toast.error(error?.data?.message || "Update failed");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;
      const { data } = await deleteProduct(params.id);
      toast.success(`${data.name} deleted successfully`);
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error(error);
      toast.error("Product deletion failed");
    }
  };

  return (
    <div className="min-h-screen mr-[20rem] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <AdminMenu />
          </div>

          <div className="lg:w-3/4">
            <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
              <div className="bg-gray-800 p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-white">Update Product</h1>
                    <p className="text-gray-400 mt-1">Edit your product details below</p>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg 
                    hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Delete Product
                  </button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Multiple Image Upload Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                    <div className="bg-gray-900 rounded-xl p-4">
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
                              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
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

                  {/* Basic Info */}
                  <div className="bg-gray-900 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Product Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter product name"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter price"
                        />
                      </div>

                      {/* <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter quantity"
                        />
                      </div> */}

                      {/* <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Brand
                        </label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter brand name"
                        />
                      </div> */}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-gray-900 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Color
                        </label>
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter product color"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Size
                        </label>
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter product size"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Inventory Info */}
                  <div className="bg-gray-900 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Count In Stock
                        </label>
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => setStock(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                          placeholder="Enter stock count"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">
                          Category
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                            text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                            transition-all duration-300"
                        >
                          <option value="">Select Category</option>
                          {categories?.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-gray-900 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Description</h2>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 
                        text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent
                        transition-all duration-300 resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white 
                        py-4 px-6 rounded-lg font-semibold text-lg
                        hover:from-green-600 hover:to-green-700
                        focus:ring-4 focus:ring-green-500/50
                        transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;