import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { secureApiCall } from './Api';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await secureApiCall(`/recipes/${id}`);
        setRecipe(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch recipe details');
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure?')) {
      try {
        await secureApiCall(`/recipes/${id}`, 'DELETE');
        navigate('/');
      } catch (err) {
        setError('Unable to delete recipe');
      }
    }
  };

  const handleRating = async (rating) => {
    try {
      await secureApiCall(`/recipes/${id}/rate`, 'POST', { rating });
      setRecipe(prevRecipe => ({
        ...prevRecipe,
        ratings: [...prevRecipe.ratings, rating],
        averageRating: (prevRecipe.ratings.reduce((a, b) => a + b, 0) + rating) / (prevRecipe.ratings.length + 1)
      }));
      setUserRating(rating);
    } catch (err) {
      setError('Failed to upload rating');
    }
  };

  const handleSaveSpoonacular = async () => {
    try {
      await secureApiCall('/recipes/save-spoonacular', 'POST', recipe);
      navigate('/');
    } catch (err) {
      setError('Failed to save Spoonacular recipe');
    }
  };

  if (loading) return <div>Loading recipe details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>

      <div className="rating">
        <p>Average Rating: {recipe.averageRating?.toFixed(1) || 'Not rated'} / 5</p>
        <p>
          Your Rating:
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              onClick={() => handleRating(star)}
              style={{cursor: 'pointer', color: star <= userRating ? 'gold' : 'gray'}}
            >
              ★
            </span>
          ))}
        </p>
      </div>

      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} style={{ width: '300px' }} />
      )}

      <h2>Ingredients:</h2>
      <ul>
        {(recipe.ingredients || recipe.extendedIngredients)?.map((ingredient, index) => (
          <li key={index}>
            {ingredient.quantity || ingredient.amount} {ingredient.unit} {ingredient.name}
          </li>
        ))}
      </ul>

      <h2>Instructions:</h2>
      <ol>
        {recipe.steps ? (
          recipe.steps.map((step, index) => <li key={index}>{step}</li>)
        ) : (
          recipe.instructions?.split('.').map((step, index) => <li key={index}>{step.trim()}</li>)
        )}
      </ol>

      {recipe.isSpoonacular ? (
        <button onClick={handleSaveSpoonacular}>Save to My Recipes</button>
      ) : (
        <>
          <button onClick={() => navigate(`/edit/${id}`)}>Edit Recipe</button>
          <button onClick={handleDelete}>Delete Recipe</button>
        </>
      )}

      <Link to="/">Back to Recipes</Link>
    </div>
  );
};

export default RecipeDetail;