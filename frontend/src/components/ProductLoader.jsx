
const ProductLoader = () => {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white/5 backdrop-blur-sm
        rounded-2xl border border-white/10 p-8 animate-pulse">
        <div className="space-y-8 w-full">
          <div className="aspect-square bg-white/10 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-white/10 rounded-lg w-3/4" />
            <div className="h-4 bg-white/10 rounded-lg w-full" />
            <div className="h-4 bg-white/10 rounded-lg w-5/6" />
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductLoader;