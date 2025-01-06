import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { secureApiCall } from './Api';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

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

    const handleSaveSpoonacular = async (recipe) => {
        try {
            await secureApiCall('/recipes/save-spoonacular', 'POST', recipe);
            alert('Recipe saved to your favorites!');
        } catch (err) {
            alert('Failed to save recipe');
        }
    };

    const handleDeleteRecipe = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await secureApiCall(`/recipes/${recipeId}`, 'DELETE');
                fetchRecipes(); // Refresh the list
                alert('Recipe deleted successfully!');
            } catch (err) {
                alert('Failed to delete recipe');
            }
        }
    };

    const styles = {
        background: {
            backgroundColor: '#F5E6D3',
            minHeight: '100vh',
            padding: '2rem 0',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1rem',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
        },
        title: {
            color: '#8B0000',
            fontSize: '2.5rem',
            margin: 0,
        },
        createButton: {
            backgroundColor: '#8B0000',
            color: '#FFFFFF',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
        },
        recipeGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
        },
        recipeCard: {
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
        },
        recipeImage: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
        },
        recipeContent: {
            padding: '1rem',
        },
        recipeTitle: {
            color: '#8B0000',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            height: '2.4rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
        },
        recipeActions: {
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
        },
        button: {
            padding: '0.5rem',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            flexGrow: 1,
            textAlign: 'center',
            fontSize: '0.9rem',
        },
        viewButton: {
            backgroundColor: '#8B0000',
            color: '#FFFFFF',
        },
        editButton: {
            backgroundColor: '#ffc107',
            color: '#000',
        },
        deleteButton: {
            backgroundColor: '#dc3545',
            color: '#FFFFFF',
        },
        saveButton: {
            backgroundColor: '#F5E6D3',
            color: '#8B0000',
            border: '1px solid #8B0000',
        },
    };

    if (loading) return <div style={styles.background}><div style={styles.container}>Loading recipes...</div></div>;
    if (error) return <div style={styles.background}><div style={styles.container}>Error: {error}</div></div>;

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Discover Recipes</h1>
                    <Link to="/create" style={styles.createButton}>Create New Recipe</Link>
                </div>
                <div style={styles.recipeGrid}>
                    {recipes.map((recipe) => (
                        <div key={recipe._id || recipe.id} style={styles.recipeCard}>
                            <img 
                                src={recipe.image} 
                                alt={recipe.title} 
                                style={styles.recipeImage}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                }}
                            />
                            <div style={styles.recipeContent}>
                                <h2 style={styles.recipeTitle}>{recipe.title}</h2>
                                <div style={styles.recipeActions}>
                                    <Link 
                                        to={`/recipe/${recipe._id || recipe.id}`} 
                                        style={{...styles.button, ...styles.viewButton}}
                                    >
                                        View
                                    </Link>
                                    {!recipe.isSpoonacular && (
                                        <>
                                            <Link 
                                                to={`/edit/${recipe._id}`}
                                                style={{...styles.button, ...styles.editButton}}
                                            >
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteRecipe(recipe._id)}
                                                style={{...styles.button, ...styles.deleteButton}}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {recipe.isSpoonacular && (
                                        <button 
                                            onClick={() => handleSaveSpoonacular(recipe)}
                                            style={{...styles.button, ...styles.saveButton}}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecipeList;