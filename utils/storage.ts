import { Bean, Recipe } from '../types';
import { MOCK_BEANS, MOCK_RECIPES } from '../data';

const BEANS_KEY = 'brewnote_beans';
const RECIPES_KEY = 'brewnote_recipes';

export const storage = {
  getBeans: (): Bean[] => {
    const stored = localStorage.getItem(BEANS_KEY);
    if (!stored) {
      // Initialize with mock data if empty
      localStorage.setItem(BEANS_KEY, JSON.stringify(MOCK_BEANS));
      return MOCK_BEANS;
    }
    return JSON.parse(stored);
  },

  saveBeans: (beans: Bean[]) => {
    localStorage.setItem(BEANS_KEY, JSON.stringify(beans));
  },

  getRecipes: (): Recipe[] => {
    const stored = localStorage.getItem(RECIPES_KEY);
    if (!stored) {
      localStorage.setItem(RECIPES_KEY, JSON.stringify(MOCK_RECIPES));
      return MOCK_RECIPES;
    }
    return JSON.parse(stored);
  },

  saveRecipes: (recipes: Recipe[]) => {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  },

  // Export all data
  exportData: () => {
    const beans = localStorage.getItem(BEANS_KEY);
    const recipes = localStorage.getItem(RECIPES_KEY);
    return {
      beans: beans ? JSON.parse(beans) : [],
      recipes: recipes ? JSON.parse(recipes) : [],
      exportedAt: new Date().toISOString(),
      version: 1
    };
  },

  // Import data
  importData: (jsonData: any) => {
    if (!jsonData || !jsonData.beans || !jsonData.recipes) {
      throw new Error('잘못된 백업 파일 형식입니다.');
    }
    localStorage.setItem(BEANS_KEY, JSON.stringify(jsonData.beans));
    localStorage.setItem(RECIPES_KEY, JSON.stringify(jsonData.recipes));
  }
};
