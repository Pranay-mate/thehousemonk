import logo from './logo.svg';
import './App.css';
import ReceipeList from './components/receipeList';
import { BrowserRouter as Router, Route, Link, Routes ,Outlet} 
       from "react-router-dom";
import RecipeDetails from './components/recipeDetails';
function App() {
  return (
    <div className="App">
     <Router>
        <Routes>
          <Route exact path="/" 
              element={<ReceipeList></ReceipeList>}>
          </Route>
          <Route path="/recipeDetails/:recipeId" 
              element={<RecipeDetails></RecipeDetails>}>
          </Route>
        </Routes>
      <Outlet></Outlet>
     </Router>
    </div>
  );
}

export default App;
