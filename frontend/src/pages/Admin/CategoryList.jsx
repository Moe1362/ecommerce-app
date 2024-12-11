import { Routes, Route } from 'react-router-dom';
import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create category, try again!");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }
    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update category, try again!");
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      toast.error("No category selected for deletion.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${selectedCategory.name}"?`)) {
      try {
        const result = await deleteCategory(selectedCategory._id).unwrap();
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success(`${selectedCategory.name} deleted successfully!`);
          setSelectedCategory(null);
          setModalVisible(false);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete category, try again!");
      }
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
            <div className= "rounded-2xl  shadow-xl p-6 transition duration-300 hover:shadow-2xl">
              <h2 className="text-3xl font-bold text-yellow-800 mb-8 pb-4 border-b border-gray-200">
                Manage Categories
              </h2>

              <div className="mb-8">
                <CategoryForm
                  value={name}
                  setValue={setName}
                  handleSubmit={handleCreateCategory}
                  buttonText="Create Category"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories?.map((category) => (
                  <div
                    key={category._id}
                    className="transform transition-all duration-300 hover:scale-105"
                  >
                    <button
                      onClick={() => {
                        setModalVisible(true);
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                      }}
                      className="w-full group relative overflow-hidden rounded-xl border-2 border-pink-500 bg-white px-4 py-3
                        text-pink-500 shadow-md transition-all duration-300
                        hover:bg-pink-500 hover:text-white hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                    >
                      <span className="relative z-10">{category.name}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 
                        transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </div>
                ))}
              </div>

              <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <CategoryForm
                  value={updatingName}
                  setValue={setUpdatingName}
                  handleSubmit={handleUpdateCategory}
                  buttonText="Update"
                  handleDelete={handleDeleteCategory}
                />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;