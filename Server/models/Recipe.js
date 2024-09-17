const { mongoose } = require('../db');

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  ingredients: [{
    name: String,
    quantity: String,
    unit: String
  }],
  steps: [String],
  ratings: [Number],
  averageRating: {
    type: Number,
    default: 0
  },
  uploadedDate: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: String,
  spoonacularId: Number
});

// Method to add a new rating (You can be honest)
RecipeSchema.methods.addRating = function(rating) {
  this.ratings.push(rating);
  this.averageRating = this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;
};

module.exports = mongoose.model('Recipe', RecipeSchema);