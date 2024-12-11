import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice.js";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice.js";
import AdminMenu from "./AdminMenu.jsx";

const ProductUpdate = () => {
  const params = useParams();

  const { data: formData } = useGetProductByIdQuery(params.id);

  const [image, setImage] = useState(formData?.image || "");
  const [name, setName] = useState(formData?.name || "");
  const [description, setDescription] = useState(formData?.description || "");
  const [price, setPrice] = useState(formData?.price || "");
  const [category, setCategory] = useState(formData?.category || "");
  const [quantity, setQuantity] = useState(formData?.quantity || "");
  const [brand, setBrand] = useState(formData?.brand || "");
  const [stock, setStock] = useState(formData?.countInStock);
  const [color, setColor] = useState(formData?.color || "");
  const [size, setSize] = useState(formData?.size || "");

  const navigate = useNavigate();

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (formData && formData._id) {
      setImage(formData.image || "");
      setName(formData.name || "");
      setDescription(formData.description || "");
      setPrice(formData.price || "");
      setCategory(formData.category || "");
      setQuantity(formData.quantity || "");
      setBrand(formData.brand || "");
      setStock(formData.countInStock || "");
      setColor(formData.color || "");
      setSize(formData.size || "");
    }
  }, [formData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (error) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      formData.append("color", color);
      formData.append("size", size);

      const result = await updateProduct({
        productId: params.id,
        formData
      }).unwrap();

      if (result._id) {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

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
                  {/* Image Section */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">Product Image</h2>
                    <div className="bg-gray-900 rounded-xl p-4">
                      {image && (
                        <div className="relative group mb-4">
                          <img
                            src={image}
                            alt="product"
                            className="w-full max-h-[300px] object-contain rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <label className="bg-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer 
                              hover:bg-pink-700 transition-colors">
                              Change Image
                              <input
                                type="file"
                                accept="image/*"
                                onChange={uploadFileHandler}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      )}

                      {!image && (
                        <label className="border-2 border-dashed border-gray-700 rounded-xl p-8 
                          flex flex-col items-center justify-center cursor-pointer
                          hover:border-pink-500 transition-all duration-300">
                          <div className="bg-gray-800 p-4 rounded-full mb-4">
                            <svg 
                              className="w-8 h-8 text-pink-500"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 4v16m8-8H4"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-400 text-sm">Click to upload product image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={uploadFileHandler}
                            className="hidden"
                          />
                        </label>
                      )}
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

                      <div>
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
                      </div>

                      <div>
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
                      </div>
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