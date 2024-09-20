const express = require('express');
const fetch = require('node-fetch');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const router = express.Router();

const API_KEY = process.env.SPOONACULAR_API_KEY;

// Get all recipes (combines Spoonacular Api and user recipes)
router.get('/', async (req, res) => {
  try {
    // Fetch from Spoonacular
    const spoonacularUrl = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=10`;
    const spoonacularResponse = await fetch(spoonacularUrl);
    const spoonacularData = await spoonacularResponse.json();
    
    // Fetch user-created recipes
    const userRecipes = await Recipe.find();
    
    // Combine and send
    const allRecipes = [
      ...spoonacularData.recipes.map(recipe => ({...recipe, isSpoonacular: true})),
      ...userRecipes
    ];
    res.json(allRecipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new recipe (created by a user)
router.post('/', auth, async (req, res) => {
  try {
    const newRecipe = new Recipe({
      ...req.body,
      user: req.user.id
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a specific recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (recipe) {
      return res.json(recipe);
    }
    // If not found local, fetch from Spoonacular
    const spoonacularUrl = `https://api.spoonacular.com/recipes/${req.params.id}/information?apiKey=${API_KEY}`;
    const spoonacularResponse = await fetch(spoonacularUrl);
    const spoonacularRecipe = await spoonacularResponse.json();
    if (spoonacularRecipe) {
      return res.json({...spoonacularRecipe, isSpoonacular: true});
    }
    return res.status(404).json({ message: 'Recipe not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a recipe
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found or' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rate a recipe
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    const rating = Number(req.body.rating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating' });
    }
    recipe.addRating(rating);
    await recipe.save();
    res.json({ averageRating: recipe.averageRating });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save a Spoonacular recipe to user's favorites
router.post('/save-spoonacular', auth, async (req, res) => {
  try {
    const { id, title, image, instructions, extendedIngredients } = req.body;
    const newRecipe = new Recipe({
      title,
      image,
      steps: instructions,
      ingredients: extendedIngredients.map(ing => ({
        name: ing.name,
        quantity: ing.amount,
        unit: ing.unit
      })),
      spoonacularId: id,
      user: req.user.id
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;