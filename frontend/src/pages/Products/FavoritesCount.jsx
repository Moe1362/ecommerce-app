import { useSelector } from "react-redux"

const FavoritesCount = () => {
  const favorites = useSelector(state => state.favorites);
  const favoriteCount = favorites.length;

  return (
    <div className="relative inline-block">
      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#DF49A6] to-[#7367F0] text-white font-bold px-2 py-1 rounded-full text-xs animate-bounce">
        {favoriteCount}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-white hover:text-[#DF49A6] transition-colors duration-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </div>
  )
}

export default FavoritesCount