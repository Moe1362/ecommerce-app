import { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState(null); // Holds the selected image file
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories = [] } = useFetchCategoriesQuery();

  // Handle image upload
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImageUrl(res.image); // Update image URL (URL of uploaded image)
      setImage(e.target.files[0]); // Store the image file for submission
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Handle product form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Product image is required.");
      return;
    }

    try {
      const productData = new FormData();
      // Add the image URL (imageUrl), not the image file, to productData
      productData.append("image", imageUrl); // Send image URL, not the image file itself
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Please try again.");
      } else {
        toast.success(`${data.name} is created successfully.`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-6">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 w-full p-6 bg-gray-900 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-white mb-6">Create Product</h1>

          {/* Display uploaded image */}
          {imageUrl && (
            <div className="text-center mb-6">
              <img
                src={imageUrl}
                alt="Product Image"
                className="block mx-auto max-h-[200px] object-contain rounded-lg"
              />
            </div>
          )}

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="border text-white px-6 py-4 block w-full text-center rounded-lg cursor-pointer font-semibold bg-blue-600 hover:bg-blue-700">
              {image ? (
                <span className="text-white">{image.name}</span>
              ) : (
                "Upload Image"
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Product Info Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="w-full md:w-1/2">
                <label htmlFor="name" className="block text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label htmlFor="price" className="block text-white mb-2">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="Enter product price"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="w-full md:w-1/2">
                <label htmlFor="quantity" className="block text-white mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  placeholder="Enter product quantity"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label htmlFor="brand" className="block text-white mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  placeholder="Enter product brand"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-white mb-2">
                Description
              </label>
              <textarea
                id="description"
                className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter product description"
              />
            </div>

            <div className="flex flex-wrap gap-6 mb-6">
              <div className="w-full md:w-1/2">
                <label htmlFor="stock" className="block text-white mb-2">
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  placeholder="Enter stock count"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label htmlFor="category" className="block text-white mb-2">
                  Category
                </label>
                <select
                  id="category"
                  className="p-4 w-full border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose Category
                  </option>
                  {categories.length ? (
                    categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading Categories...</option>
                  )}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="py-4 px-10 mt-6 rounded-lg text-lg font-bold bg-pink-600 text-white w-full hover:bg-pink-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
