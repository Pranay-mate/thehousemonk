import logo from './logo.svg';
import './App.css';
import ReceipeList from './components/receipeList';
import { HashRouter as Router, Route, Link, Routes ,Outlet} 
       from "react-router-dom";
import RecipeDetails from './components/recipeDetails';
function App() {
  console.log(process.env.NODE_ENV)
  return (
    <div className="App">
     <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route  exact path='/'
              element={<ReceipeList></ReceipeList>}>
          </Route>
          <Route exact path="/recipeDetails/:recipeId" 
              element={<RecipeDetails></RecipeDetails>}>
          </Route>
        </Routes>
     </Router>
    </div>
  );
}

export default App;
