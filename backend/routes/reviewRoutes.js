const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

// Get reviews for a specific product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a review for a product
router.post("/", async (req, res) => {
  const { productId, userName, rating, comment } = req.body;

  try {
    const review = new Review({
      productId,
      userName,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
