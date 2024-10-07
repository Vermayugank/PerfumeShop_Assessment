import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState("");
  const [userName, setUserName] = useState("Anonymous"); // Default username
  const [rating, setRating] = useState(1); // Default rating
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(""); // State for the selected image

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // Fetch product details
        const productResponse = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await productResponse.json();
        setProduct(productData);
        setSelectedImage(productData.images[0]); // Set default selected image to the first image

        // Fetch reviews for the product
        const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/${productId}`);
        if (!reviewsResponse.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      productId: product._id,
      userName,
      rating,
      comment: review,
    };

    // Send the review to your backend
    try {
      const response = await fetch(`http://localhost:5000/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const savedReview = await response.json();
      setReviews((prevReviews) => [...prevReviews, savedReview]); // Add the new review to the state
      setReview(""); // Clear the review input
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image); // Update selected image on thumbnail click
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div> 
      </div>
    );
  }

  if (error) {
    return <h1 className="text-red-600">Error: {error}</h1>;
  }

  if (!product) {
    return <h1 className="text-gray-600">Product not found!</h1>;
  }

  return (
    <div className="container mx-auto my-8">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images Gallery */}
        <div>
          <img
            src={selectedImage} // Use selectedImage for the main display
            alt={product.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={product.name}
                className="w-full h-20 object-cover rounded-lg cursor-pointer" // Add cursor pointer for better UX
                onClick={() => handleImageClick(image)} // Set onClick event for changing the main image
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-bold mb-4">₹{product.price.toFixed(2)}</p>

          {/* Available Sizes */}
          <div className="mb-4">
            <span className="font-semibold">Available Sizes: </span>
            {product.sizes.map((size, index) => (
              <span key={index} className="ml-2">{size}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        <div className="mb-4">
          {reviews.length ? (
            reviews.map((r, index) => (
              <div key={index} className="border-b border-gray-300 mb-2 pb-2">
                <p className="text-gray-700">{r.comment}</p>
                <p className="text-yellow-500">Rating: {r.rating} / 5</p>
                <p className="text-gray-500">- {r.userName}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {/* Add a Review */}
        <form onSubmit={handleReviewSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Write your review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <div className="mt-2 flex items-center">
            <label htmlFor="username" className="mr-2">Username:</label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2"
            />
            <label htmlFor="rating" className="ml-4 mr-2">Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-2"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 mt-2 rounded-lg hover:bg-green-500 transition duration-300"
          >
            Submit Review
          </button>
        </form>

        {/* Back Button */}
        <Link to="/" className="inline-block mt-4 text-blue-500 underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ProductPage;
