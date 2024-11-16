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
        if(result.error) {
            toast.error(result.error);
        } else {
            setName("");
            toast.success(`${result.name} is created`);
            
        }


    } catch (error) {
        console.error(error);
        toast.error("Failed to create category, try again!");
    }
    }

    const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
        toast.error("Category name is required");
        return;
    }
    try {
        const result = await updateCategory({ categoryId: selectedCategory._id, updatedCategory: {name: updatingName} }).unwrap();
        if(result.error) {
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
}

const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      toast.error("No category selected for deletion.");
      return;
    }
  
    // Confirm before deletion
    if (window.confirm(`Are you sure you want to delete the category "${selectedCategory.name}"?`)) {
      try {
        // Call the deleteCategory mutation and pass the categoryId
        const result = await deleteCategory(selectedCategory._id).unwrap();
        
        // Check if there's any error in the result
        if (result?.error) {
          toast.error(result.error);  // Handle error response if it contains an error field
        } else {
          toast.success(`${selectedCategory.name} has been deleted successfully!`);
          setSelectedCategory(null);  // Reset the selected category
          setModalVisible(false);     // Close modal
        }
      } catch (error) {
        // If error occurs, log it and show a generic error message
        console.error(error);
        toast.error(error?.data?.message || "Failed to delete category, try again!");
      }
    }
  };
  


  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      {/* <AdminMenu /> */}
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm value={name} setValue={setName} handleSubmit={handleCreateCategory} />
        <br />
        <hr />
        <div className="flex flex-wrap">
            {categories?.map((category) => (
                <div key={category._id}>
                    <button className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                    onClick={() => {{
                        setModalVisible(true);
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                    }}}>
                        {category.name}
                    </button>
                </div>
            ))}
        </div>
            <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
                <CategoryForm value={updatingName} setValue={value => setUpdatingName(value)}
                handleSubmit={handleUpdateCategory}
                buttonText="Update" 
                handleDelete={handleDeleteCategory}
                />
                </Modal>        

      </div>
    </div>
  );
};

export default CategoryList;
