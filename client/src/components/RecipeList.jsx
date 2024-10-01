import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { secureApiCall } from './Api';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const data = await secureApiCall('/recipes', 'GET');
          setRecipes(data);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch recipes');
          setLoading(false);
        }
      };
 
      fetchRecipes();
    }, []);
 
    const handleSaveSpoonacular = async (recipe) => {
      try {
        await secureApiCall('/recipes/save-spoonacular', 'POST', recipe);
        alert('Recipe saved to your favorites!');
      } catch (err) {
        alert('Failed to save recipe');
      }
    };

    if (loading) return <div>Loading recipes...</div>;
    if (error) return <div>Error: {error}</div>;
 
    return (
      <div className="recipes-container">
        <div className="recipes-header">
          <h1 className="recipes-title">Discover Recipes</h1>
          <Link to="/create-recipe" className="create-recipe-btn">Create New Recipe</Link>
        </div>
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image} alt={recipe.title} className="recipe-image" />
              <div className="recipe-content">
                <h2 className="recipe-title">{recipe.title}</h2>
                <div className="recipe-actions">
                  <Link to={`/recipe/${recipe.id}`} className="btn btn-view">View</Link>
                  <button className="btn btn-save">Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default RecipeList;