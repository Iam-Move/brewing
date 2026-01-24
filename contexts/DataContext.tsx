import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bean, Recipe } from '../types';
import { storage } from '../utils/storage';

interface DataContextType {
    beans: Bean[];
    recipes: Recipe[];
    addBean: (bean: Omit<Bean, 'id'>) => void;
    updateBean: (bean: Bean) => void;
    deleteBean: (id: string) => void;
    addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
    updateRecipe: (recipe: Recipe) => void;
    deleteRecipe: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [beans, setBeans] = useState<Bean[]>([]);
    const [recipes, setRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        setBeans(storage.getBeans());
        setRecipes(storage.getRecipes());
    }, []);

    const addBean = (beanData: Omit<Bean, 'id'>) => {
        const newBean: Bean = {
            ...beanData,
            id: Date.now().toString(), // Simple ID generation
        };
        const updatedBeans = [newBean, ...beans];
        setBeans(updatedBeans);
        storage.saveBeans(updatedBeans);
    };

    const updateBean = (updatedBean: Bean) => {
        const updatedBeans = beans.map((b) => (b.id === updatedBean.id ? updatedBean : b));
        setBeans(updatedBeans);
        storage.saveBeans(updatedBeans);
    };

    const deleteBean = (id: string) => {
        const updatedBeans = beans.filter((b) => b.id !== id);
        setBeans(updatedBeans);
        storage.saveBeans(updatedBeans);
    };

    const addRecipe = (recipeData: Omit<Recipe, 'id'>) => {
        const newRecipe: Recipe = {
            ...recipeData,
            id: Date.now().toString(),
        };
        const updatedRecipes = [newRecipe, ...recipes];
        setRecipes(updatedRecipes);
        storage.saveRecipes(updatedRecipes);
    };

    const updateRecipe = (updatedRecipe: Recipe) => {
        const updatedRecipes = recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r));
        setRecipes(updatedRecipes);
        storage.saveRecipes(updatedRecipes);
    };

    const deleteRecipe = (id: string) => {
        const updatedRecipes = recipes.filter((r) => r.id !== id);
        setRecipes(updatedRecipes);
        storage.saveRecipes(updatedRecipes);
    };

    return (
        <DataContext.Provider
            value={{
                beans,
                recipes,
                addBean,
                updateBean,
                deleteBean,
                addRecipe,
                updateRecipe,
                deleteRecipe,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
