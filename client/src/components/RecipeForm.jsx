import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { secureApiCall } from './utils/Api';

const RecipeForm = () => {
  
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [steps, setSteps] = useState(['']);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // Get the recipe ID from the URL if editing

  // fetch recipe data if editing
  useEffect(() => {
    if (id) {
      const fetchRecipe = async () => {
        try {
          const data = await secureApiCall(`/recipes/${id}`);
          setTitle(data.title);
          setIngredients(data.ingredients);
          setSteps(data.steps);
        } catch (err) {
          setError('Failed to fetch recipe for editing');
        }
      };
      fetchRecipe();
    }
  }, [id]);

  // changes to ingredients
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Add a new ingredient
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  // Changes to steps
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  // Add a new step
  const addStep = () => {
    setSteps([...steps, '']);
  };

  //form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = { title, ingredients, steps };
    try {
      if (id) {
        await secureApiCall(`/recipes/${id}`, 'PUT', recipeData);
      } else {
        await secureApiCall('/recipes', 'POST', recipeData);
      }
      navigate('/');
    } catch (err) {
      setError(`Failed to ${id ? 'update' : 'create'} recipe`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{id ? 'Edit Recipe' : 'Create New Recipe'}</h2>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <h3>Ingredients:</h3>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Ingredient name"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Unit"
            value={ingredient.unit}
            onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addIngredient}>Add Ingredient</button>
      <h3>Steps:</h3>
      {steps.map((step, index) => (
        <div key={index}>
          <textarea
            value={step}
            onChange={(e) => handleStepChange(index, e.target.value)}
            required
          />
        </div>
      ))}
      <button type="button" onClick={addStep}>Add Step</button>
      <button type="submit">{id ? 'Update Recipe' : 'Create Recipe'}</button>
    </form>
  );
};

export default RecipeForm;