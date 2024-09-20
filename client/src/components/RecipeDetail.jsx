import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { secureApiCall } from './Api';
const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch recipe details
    const fetchRecipe = async () => {
      try {
        // Make a GET request to fetch recipe details
        const response = await fetch(`/api/recipe/${id}`);
        
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }
        
        // Parse the JSON response
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        // If there's an error, set it in state
        setError('Failed to fetch recipe details');
        console.error('Error fetching recipe:', err);
      } finally {
        // Set loading to false whether the request succeeded or failed
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Function to handle recipe deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        // Make a DELETE request to remove the recipe
        const response = await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error('Failed to delete recipe');
        }
        
        // If deletion was successful, navigate back to the home page
        navigate('/');
      } catch (err) {
        setError('Unable to delete recipe');
        console.error('Error deleting recipe:', err);
      }
    }
  };

  // Show loading state while fetching data
  if (loading) return <div>Loading recipe details...</div>;
  
  // Show error message if there was an error
  if (error) return <div>Error: {error}</div>;
  
  // Show message if recipe was not found
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>

      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} style={{ width: '300px' }} />
      )}

      <h2>Ingredients:</h2>
      <ul>
        {recipe.ingredients?.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>

      <h2>Instructions:</h2>
      <ol>
        {recipe.instructions?.split('.').filter(step => step.trim()).map((step, index) => (
          <li key={index}>{step.trim()}</li>
        ))}
      </ol>

      <button onClick={() => navigate(`/edit/${id}`)}>Edit Recipe</button>
      <button onClick={handleDelete}>Delete Recipe</button>

      <Link to="/">Back to Recipes</Link>
    </div>
  );
};

export default RecipeDetail;