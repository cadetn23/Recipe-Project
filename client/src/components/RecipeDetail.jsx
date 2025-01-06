import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { secureApiCall } from './Api';
import { getToken } from './authToken';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      try {
        // Try to fetch the recipe
        const data = await secureApiCall(`/recipes/${id}`, 'GET');
        console.log('Fetched recipe:', data);
        
        if (data) {
          // Format the recipe data 
          const formattedRecipe = data.spoonacularId ? {
            ...data,
            ingredients: data.extendedIngredients?.map(ing => ({
              name: ing.name || ing.original,
              quantity: ing.amount,
              unit: ing.unit
            })) || data.ingredients,
            steps: data.analyzedInstructions?.[0]?.steps.map(step => step.step) || 
                   [data.instructions] || 
                   data.steps
          } : data;

          setRecipe(formattedRecipe);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <p>Loading recipe...</p>
          <Link to="/" className="btn btn-outline-primary mt-2">Back to Recipes</Link>
        </div>
      </div>
    );
  }

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '0 1rem',
    },
    title: {
      color: '#8B0000',
      marginBottom: '1.5rem',
    },
    image: {
      width: '100%',
      maxHeight: '400px',
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
    section: {
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
      color: '#8B0000',
      marginBottom: '1rem',
    },
    backLink: {
      display: 'inline-block',
      marginTop: '1rem',
      color: '#8B0000',
      textDecoration: 'none',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{recipe.title}</h1>
      
      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          style={styles.image}
        />
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Ingredients</h2>
        <ul className="list-unstyled">
          {recipe.ingredients?.map((ingredient, index) => (
            <li key={index} className="mb-2">
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Instructions</h2>
        <ol>
          {Array.isArray(recipe.steps) ? 
            recipe.steps.map((step, index) => (
              <li key={index} className="mb-3">{step}</li>
            ))
            :
            <li>{recipe.steps || recipe.instructions}</li>
          }
        </ol>
      </div>

      <Link to="/" style={styles.backLink}>
        ← Back to Recipes
      </Link>
    </div>
  );
};

export default RecipeDetail;