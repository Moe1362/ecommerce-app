import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const SocialLink = ({ Icon, href, hoverColor }) => (
  <motion.a
    href={href}
    whileHover={{ 
      scale: 1.1,
      rotate: [0, 5, -5, 0],
      transition: { duration: 0.3 }
    }}
    whileTap={{ scale: 0.9 }}
    className={`group p-3 rounded-2xl 
      bg-gray-900/10 
      border border-gray-800/30 
      hover:bg-gray-800/20
      hover:shadow-lg transition-all duration-300 
      inline-block ${hoverColor}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon className="text-lg text-gray-300 
      transition-all duration-300 group-hover:scale-110" />
  </motion.a>
);

const Footer = () => {
  return (
    <footer className="relative bg-black text-gray-100 rounded-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-16 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-400 via-gray-300 to-white">
              NILASH
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Discover our unique collection of fashion and accessories. 
              Quality products for the modern lifestyle.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: FaFacebookF, href: "#", hoverColor: "hover:text-blue-500 hover:border-blue-500/30" },
                { Icon: FaTwitter, href: "#", hoverColor: "hover:text-sky-500 hover:border-sky-500/30" },
                { Icon: FaInstagram, href: "#", hoverColor: "hover:text-purple-500 hover:border-purple-500/30" },
                { Icon: FaLinkedinIn, href: "#", hoverColor: "hover:text-blue-500 hover:border-blue-500/30" },
              ].map((social, index) => (
                <SocialLink key={index} {...social} />
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
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
                    className="group flex items-center text-gray-400 
                      hover:text-white 
                      transition-colors duration-300 
                      rounded-lg hover:bg-white/5 px-2 py-1"
                  >
                    <motion.span 
                      whileHover={{ x: 10 }}
                      className="flex items-center"
                    >
                      {link.text}
                      <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Contact Info</h3>
            <ul className="space-y-4">
              {[
                { 
                  icon: FaMapMarkerAlt, 
                  text: "San Jose, CA",
                  gradient: "from-gray-700 to-gray-900"
                },
                { 
                  icon: FaPhone, 
                  text: "+1 4086697779",
                  link: "tel:+14086697779",
                  gradient: "from-gray-700 to-gray-900"
                },
                { 
                  icon: FaEnvelope, 
                  text: "moe.abbasi1983@gmail.com",
                  link: "mailto:moe.abbasi1983@gmail.com",
                  gradient: "from-gray-700 to-gray-900"
                },
              ].map((item, index) => (
                <li key={index}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="group flex items-center gap-3 p-3 
                      rounded-2xl hover:bg-gray-800/20 
                      transition-all duration-300"
                  >
                    <div className={`bg-gradient-to-r ${item.gradient} p-2 rounded-xl`}>
                      <item.icon className="text-white" />
                    </div>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        className="text-gray-400 
                          hover:text-white 
                          transition-colors rounded-lg"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-gray-400 
                        group-hover:text-white 
                        transition-colors">
                        {item.text}
                      </span>
                    )}
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-xl font-bold text-white mb-6">Newsletter</h3>
            <div className="space-y-4">
              <p className="text-gray-400">
                Subscribe to our newsletter for updates and offers.
              </p>
              <form className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full p-4 
                      bg-gray-900/30 
                      border border-gray-800/50 
                      rounded-2xl text-white
                      placeholder:text-gray-500
                      focus:outline-none focus:border-gray-700
                      transition-colors duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full p-4 rounded-2xl text-white 
                    bg-gradient-to-r from-gray-800 to-black 
                    hover:from-gray-700 hover:to-gray-900
                    transition-all duration-300"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-800 rounded-b-3xl"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Nilish. All rights reserved.
            </p>
            <p className="text-gray-400 flex items-center gap-2">
              Made with 
              <motion.span
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ['#6b7280', '#ef4444', '#6b7280']
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FaHeart />
              </motion.span>
              by Nilish Team
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;