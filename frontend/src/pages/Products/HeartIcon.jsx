import { useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorites/favoriteSlice";
import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites || []);
    const isFavorite = favorites.some((p) => p._id === product._id);

    useEffect(() => {
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    }, []);

    const toggleFavorites = () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(product));
            removeFavoriteFromLocalStorage(product._id);
        } else {
            dispatch(addToFavorites(product));
            addFavoriteToLocalStorage(product);
        }
    }

    return (
        <div 
            onClick={toggleFavorites} 
            className="group relative p-2 cursor-pointer"
        >
            <div className="relative z-10 transition-transform duration-300 ease-in-out transform group-hover:scale-110">
                {isFavorite ? (
                    <div className="animate-heartBeat">
                        <FaHeart className="text-2xl text-pink-500 filter drop-shadow-glow transition-all duration-300" />
                        <div className="absolute inset-0 bg-pink-500 opacity-20 blur-md animate-pulse rounded-full" />
                    </div>
                ) : (
                    <div className="transform transition-all duration-300 hover:scale-110">
                        <FaRegHeart className="text-2xl text-white/80 hover:text-pink-500/80 transition-colors duration-300" />
                    </div>
                )}
            </div>

            {/* Click effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 animate-clickRing opacity-0 group-active:opacity-100">
                    <div className="absolute inset-0 bg-pink-500/20 rounded-full animate-ping" />
                </div>
            </div>

            <style jsx global>{`
                @keyframes heartBeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.2); }
                    50% { transform: scale(0.95); }
                    75% { transform: scale(1.1); }
                }

                @keyframes clickRing {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }

                .animate-heartBeat {
                    animation: heartBeat 0.8s ease-in-out;
                }

                .animate-clickRing > div {
                    animation: clickRing 0.6s ease-out;
                }

                .filter.drop-shadow-glow {
                    filter: drop-shadow(0 0 8px rgba(236, 72, 153, 0.5));
                }
            `}</style>
        </div>
    );
};

export default HeartIcon;