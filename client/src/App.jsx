import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import RecipeList from './components/RecipeList';
import RecipeForm from './components/RecipeForm';
import RecipeDetail from './components/RecipeDetail';
import AuthRoute from './components/AuthRoute';
import './App.css';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<RecipeList />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            
            {/* Protected/Requires authenticaitoin bruh unnecesarrily long word */}
            <Route element={<AuthRoute />}>
              <Route path="/create" element={<RecipeForm />} />
              <Route path="/edit/:id" element={<RecipeForm />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;