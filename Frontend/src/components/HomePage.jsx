import { useEffect, useState } from "react"; 
import { Link } from "react-router-dom"; 

const HomePage = () => {
  const [products, setProducts] = useState([]); // State to hold the fetched products
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error messages if fetching fails

  // useEffect hook to fetch products when the component mounts
  useEffect(() => {
    // Function to fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products"); // Fetch products from API
        if (!response.ok) {
          // Check if the response is okay (status code 200-299)
          throw new Error("Failed to fetch products"); // If not, throw an error
        }
        const data = await response.json(); // Convert the response to JSON
        setProducts(data); // Set the fetched products in state
      } catch (err) {
        setError(err.message); // Catch and store any errors that occur during fetch
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchProducts(); // Call the fetch function to get products

  }, []); // Empty dependency array means this effect runs only once after the initial render (component mount)

  // If the products are still being fetched, show a loading message
  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // If an error occurred during fetching, display the error message
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }


  
  // Main content to be rendered after products are successfully fetched
  return (
    <div className="bg-gray-50">
      
      {/* Call to Action Banner */}
      <div className="bg-blue-500 text-white text-center py-10">
        <h2 className="text-4xl font-bold mb-2">Explore Our Latest Collections!</h2>
        <p className="mb-4 text-lg">
          Discover special offers on your favorite perfumes.
        </p>
        {/* Link to navigate to a different page, could be the shop page */}
        <Link
          to="/"
          className="bg-white text-blue-500 font-semibold px-6 py-2 rounded hover:bg-blue-100 transition duration-300"
        >
          Shop Now
        </Link>
      </div>

      {/* Products Section */}
      <div className="container mx-auto my-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Our Perfumes</h1>
        {/* Grid layout to display product cards, adjusts based on screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Mapping through the fetched products to display each one */}
          {products.map((product) => (
            // Each product is wrapped inside a Link component for navigation to its detail page
            <Link to={`/product/${product._id}`} key={product._id}>
              <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 rounded-lg h-full group">
                {/* Product image with hover effect to scale */}
                <img
                  src={product.images[0]} // Accessing the first image in the images array
                  alt={product.name} // Alt text for image accessibility
                  className="w-full h-48 object-cover rounded-lg mb-4 transition-transform duration-300 group-hover:scale-105"
                />
                {/* Product name */}
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                {/* Product description, truncated to two lines using CSS for consistent card size */}
                <p className="text-gray-700 mb-2 line-clamp-2 overflow-hidden">
                  {product.description}
                </p>
                {/* Product price */}
                <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
