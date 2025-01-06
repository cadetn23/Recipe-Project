import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { secureApiCall } from './Api';

const RecipeForm = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [steps, setSteps] = useState(['']);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            const fetchRecipe = async () => {
                try {
                    setLoading(true);
                    const data = await secureApiCall(`/recipes/${id}`);
                    setTitle(data.title);
                    setIngredients(data.ingredients);
                    setSteps(data.steps);
                } catch (err) {
                    setError('Failed to fetch recipe for editing');
                } finally {
                    setLoading(false);
                }
            };
            fetchRecipe();
        }
    }, [id]);

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index) => {
        if (ingredients.length > 1) {
            setIngredients(ingredients.filter((_, i) => i !== index));
        }
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...steps];
        newSteps[index] = value;
        setSteps(newSteps);
    };

    const addStep = () => {
        setSteps([...steps, '']);
    };

    const removeStep = (index) => {
        if (steps.length > 1) {
            setSteps(steps.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validate inputs
        if (!title.trim()) {
            setError('Title is required');
            setLoading(false);
            return;
        }

        if (ingredients.some(ing => !ing.name.trim() || !ing.quantity.trim())) {
            setError('All ingredients must have a name and quantity');
            setLoading(false);
            return;
        }

        if (steps.some(step => !step.trim())) {
            setError('All steps must have content');
            setLoading(false);
            return;
        }

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
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '2rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        title: {
            color: '#8B0000',
            marginBottom: '1.5rem',
        },
        formGroup: {
            marginBottom: '1.5rem',
        },
        label: {
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
            color: '#333',
        },
        input: {
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
        },
        ingredientRow: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
        },
        button: {
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
        },
        primaryButton: {
            backgroundColor: '#8B0000',
            color: '#FFFFFF',
            marginRight: '1rem',
        },
        secondaryButton: {
            backgroundColor: '#F5E6D3',
            color: '#8B0000',
            border: '1px solid #8B0000',
        },
        deleteButton: {
            backgroundColor: '#dc3545',
            color: '#FFFFFF',
        },
        textarea: {
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '4px',
            minHeight: '100px',
        },
        error: {
            color: '#dc3545',
            marginBottom: '1rem',
            padding: '0.5rem',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
        }
    };

    if (loading && !title) {
        return <div style={styles.container}>Loading...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{id ? 'Edit Recipe' : 'Create New Recipe'}</h2>
            {error && <div style={styles.error}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="title">Recipe Title:</label>
                    <input
                        style={styles.input}
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div style={styles.formGroup}>
                    <h3 style={styles.title}>Ingredients:</h3>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} style={styles.ingredientRow}>
                            <input
                                style={{ ...styles.input, width: '25%' }}
                                type="text"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                required
                            />
                            <input
                                style={{ ...styles.input, width: '25%' }}
                                type="text"
                                placeholder="Unit"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            />
                            <input
                                style={{ ...styles.input, width: '40%' }}
                                type="text"
                                placeholder="Ingredient name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeIngredient(index)}
                                style={{ ...styles.button, ...styles.deleteButton }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={addIngredient}
                        style={{ ...styles.button, ...styles.secondaryButton }}
                    >
                        Add Ingredient
                    </button>
                </div>

                <div style={styles.formGroup}>
                    <h3 style={styles.title}>Steps:</h3>
                    {steps.map((step, index) => (
                        <div key={index} style={styles.ingredientRow}>
                            <textarea
                                style={styles.textarea}
                                value={step}
                                onChange={(e) => handleStepChange(index, e.target.value)}
                                placeholder={`Step ${index + 1}`}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeStep(index)}
                                style={{ ...styles.button, ...styles.deleteButton }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <button 
                        type="button" 
                        onClick={addStep}
                        style={{ ...styles.button, ...styles.secondaryButton }}
                    >
                        Add Step
                    </button>
                </div>

                <div style={styles.formGroup}>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ ...styles.button, ...styles.primaryButton }}
                    >
                        {loading ? 'Saving...' : (id ? 'Update Recipe' : 'Create Recipe')}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/')}
                        style={{ ...styles.button, ...styles.secondaryButton }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecipeForm;