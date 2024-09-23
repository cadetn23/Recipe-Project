import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { secureApiCall } from './Api';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        console.log('Fetching details for recipe:', id);
        const recipeDetails = await secureApiCall(`/recipes/${id}`);
        console.log('Received recipe details:', recipeDetails);
        setRecipe(recipeDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError('Failed to fetch recipe details');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <div>Loading recipe details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} style={{ width: '300px' }} />
      )}
      <h2>Ingredients:</h2>
      <ul>
        {recipe.extendedIngredients.map((ingredient, index) => (
          <li key={index}>{ingredient.original}</li>
        ))}
      </ul>
      <h2>Instructions:</h2>
      <div dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
      <Link to="/">Back to Recipes</Link>
    </div>
  );
};

export default RecipeDetail;