import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";

const SIZES = ["XS", "S", "M", "L", "XL"]; 
const COLORS = ["Black", "White", "Red", "Blue", "Green"];

const ProductList = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();

  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("size", selectedSize);
      productData.append("color", selectedColor);

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
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
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
                {/* Image Upload Section */}
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm font-medium mb-2">
                    Product Image
                  </label>
                  {imageUrl ? (
                    <div className="relative group">
                      <img
                        src={imageUrl}
                        alt="product"
                        className="w-full max-h-[300px] object-contain rounded-lg border-2 border-gray-700"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <label className="bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-700 transition-colors duration-300">
                          Change Image
                          <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="hidden"
                            accept="image/*"
                          />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500 transition-colors duration-300">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-gray-400">Click to upload image</span>
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="hidden"
                        accept="image/*"
                      />
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="hidden"
                        accept="image/*"
                      />
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="hidden"
                        accept="image/*"
                      />
                      <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  )}
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
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">
                        Category
                      </label>
                      <select
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
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