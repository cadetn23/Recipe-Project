import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { secureApiCall } from './utils/Api';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
      const fetchRecipes = async () => {
        try {
          const data = await secureApiCall('/recipes');
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
      <div>
        <h1>Recipes</h1>
        <Link to="/create">Create New Recipe</Link>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id || recipe._id}>
              <h2>{recipe.title}</h2>
              {recipe.image && <img src={recipe.image} alt={recipe.title} style={{width: '200px'}} />}
              <Link to={`/recipe/${recipe.id || recipe._id}`}>View Details</Link>
              {recipe.isSpoonacular && (
                <button onClick={() => handleSaveSpoonacular(recipe)}>Save to My Recipes</button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
}

export default RecipeList;