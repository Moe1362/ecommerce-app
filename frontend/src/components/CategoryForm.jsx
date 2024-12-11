const CategoryForm = ({
  value,
  setValue,
  handleSubmit,
  buttonText = "Submit",
  handleDelete,
}) => {
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative rounded-lg shadow-sm">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="block w-full rounded-lg border-2 border-gray-200 px-4 py-3 text-gray-900 
              placeholder-gray-500 transition-colors duration-200
              focus:border-pink-500 focus:outline-none focus:ring-pink-500"
            placeholder="Enter category name..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 justify-center rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 
              px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200
              hover:from-pink-600 hover:to-pink-700 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            {buttonText}
          </button>

          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 justify-center rounded-lg bg-gradient-to-r from-red-500 to-red-600 
                px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200
                hover:from-red-600 hover:to-red-700 hover:shadow-md
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;