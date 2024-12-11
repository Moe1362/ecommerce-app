// components/ProductTabs.jsx
import { useState } from "react";
import { Star } from "lucide-react";
import moment from "moment";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10">
      {/* Tabs Header */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-6 py-4 text-sm font-medium transition-colors relative
            ${activeTab === "reviews" 
              ? "text-white" 
              : "text-white/60 hover:text-white"}
          `}
        >
          Reviews ({product.reviews.length})
          {activeTab === "reviews" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
          )}
        </button>
      </div>

      {/* Tabs Content */}
      <div className="p-6">
        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Review Form */}
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-colors"
                      >
                        <Star 
                          className={`w-6 h-6 ${
                            rating >= star 
                              ? "fill-yellow-500 stroke-yellow-500" 
                              : "stroke-white/40"
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Comment</label>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20
                      text-white placeholder-white/30 focus:border-white/40 transition-all"
                    placeholder="Write your review..."
                  />
                </div>

               
              </form>
            ) : (
              <p className="text-white/70">
                Please{" "}
                <Link to="/login" className="text-white underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            )}

           
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;