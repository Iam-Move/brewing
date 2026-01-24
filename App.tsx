import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Splash from './pages/Splash';
import BeanList from './pages/BeanList';
import BeanDetail from './pages/BeanDetail';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import PouringSelect from './pages/PouringSelect';
import PouringRecipeSelect from './pages/PouringRecipeSelect';
import PouringTimer from './pages/PouringTimer';
import FreeTimer from './pages/FreeTimer';
import BeanForm from './pages/BeanForm';
import RecipeForm from './pages/RecipeForm';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import { DataProvider } from './contexts/DataContext';

const Layout = () => {
  return (
    <div className="max-w-md mx-auto relative bg-background min-h-screen shadow-2xl overflow-hidden text-textMain">
      <Outlet />
      <BottomNav />
      <InstallPrompt />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Splash />} />
            <Route path="beans" element={<BeanList />} />
            <Route path="beans/new" element={<BeanForm />} />
            <Route path="beans/:id/edit" element={<BeanForm />} />
            <Route path="beans/:id" element={<BeanDetail />} />
            <Route path="recipes" element={<RecipeList />} />
            <Route path="recipes/new" element={<RecipeForm />} />
            <Route path="recipes/:id/edit" element={<RecipeForm />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="pouring" element={<PouringSelect />} />
            <Route path="pouring/select-recipe" element={<PouringRecipeSelect />} />
            <Route path="pouring/recipe/:recipeId" element={<PouringTimer />} />
            <Route path="pouring/free" element={<FreeTimer />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
