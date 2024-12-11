import { Link } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHeart,
  FaArrowRight
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0f0f10] via-[#1a1a1a] to-[#0f0f10] text-gray-300 border-t border-gray-800 font-mono">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-4 transform hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#DF49A6] via-[#7367F0] to-[#DF49A6] 
              bg-clip-text text-transparent animate-gradient">NILASH</h2>
            <p className="text-gray-400 leading-relaxed hover:text-gray-300 transition-colors duration-300">
              Discover our unique collection of fashion and accessories. 
              Quality products for the modern lifestyle.
            </p>
            <div className="flex space-x-4 pt-4">
              {[
                { icon: FaFacebookF, link: "#", color: "hover:bg-blue-600" },
                { icon: FaTwitter, link: "#", color: "hover:bg-sky-500" },
                { icon: FaInstagram, link: "#", color: "hover:bg-pink-600" },
                { icon: FaLinkedinIn, link: "#", color: "hover:bg-blue-700" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  className={`w-10 h-10 bg-gray-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center
                    ${social.color} hover:scale-110 transform transition-all duration-300 group`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { text: "Home", link: "/" },
                { text: "Shop", link: "/shop" },
                { text: "Cart", link: "/cart" },
                { text: "Favorites", link: "/favorite" },
                { text: "My Account", link: "/profile" },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.link}
                    className="text-gray-400 hover:text-[#DF49A6] transition-all duration-300 
                      flex items-center space-x-2 group"
                  >
                    <FaArrowRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 
                      group-hover:translate-x-0 transition-all duration-300" />
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {link.text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 tracking-wider">Contact Info</h3>
            <ul className="space-y-4">
              {[
                { 
                  icon: FaMapMarkerAlt, 
                  text: "123 Street Name, City, Country" 
                },
                { 
                  icon: FaPhone, 
                  text: "+1 234 567 8900",
                  link: "tel:+12345678900"
                },
                { 
                  icon: FaEnvelope, 
                  text: "contact@nilish.com",
                  link: "mailto:contact@nilish.com"
                },
              ].map((item, index) => (
                <li key={index} className="group">
                  <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/30 
                    transition-all duration-300">
                    <item.icon className="text-[#DF49A6] group-hover:scale-110 transform transition-all duration-300" />
                    {item.link ? (
                      <a 
                        href={item.link}
                        className="text-gray-400 group-hover:text-[#DF49A6] transition-colors duration-300"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-gray-400 group-hover:text-[#DF49A6] transition-colors duration-300">
                        {item.text}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-6 tracking-wider">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-3">
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg 
                    focus:outline-none focus:border-[#DF49A6] transition-all duration-300
                    group-hover:border-[#DF49A6]/50"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#DF49A6] to-[#7367F0] 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-[#DF49A6] to-[#7367F0] text-white rounded-lg 
                  hover:from-[#7367F0] hover:to-[#DF49A6] transform hover:-translate-y-1 transition-all duration-300
                  hover:shadow-lg hover:shadow-[#DF49A6]/25"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-center md:text-left hover:text-gray-200 transition-colors duration-300">
              © {new Date().getFullYear()} Nilish. All rights reserved.
            </p>
            <p className="text-gray-300 flex items-center mt-4 md:mt-0 group">
              Made with 
              <FaHeart className="text-[#DF49A6] mx-2 animate-pulse group-hover:scale-110 transition-transform duration-300" /> 
              by Nilish Team
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;