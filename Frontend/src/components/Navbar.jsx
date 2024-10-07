import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 text-white shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Perfume Store</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-400 transition duration-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-400 transition duration-300">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
