import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";




const AdminMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
  return (
    <>
        <button className={`${isMenuOpen ? "top-2 right-2" : 'top-5 right-7'} bg-[#151515] p-2 fixed rounded-lg`} 
        onClick={toggleMenu}>
            {isMenuOpen ? (
                <FaTimes color="white" size={20} />
            ) :(
                <>
                    <div className="w-6 h-0.5 bg-white my-1"></div>
                    <div className="w-6 h-0.5 bg-white my-1"></div>
                    <div className="w-6 h-0.5 bg-white my-1"></div>
                
                </>
            )}
        </button>
    
    
    
    </>
  )
}

export default AdminMenu