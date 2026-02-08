import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bean, Recipe, TastingRecord } from '../types';
import { storage } from '../utils/storage';
import { safeDateToISOString } from '../utils/dateUtils';

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
        const loadedBeans = storage.getBeans();
        const loadedRecipes = storage.getRecipes();

        // Migration Logic: Convert legacy score/memo/myNotes to TastingRecord
        const migratedBeans = loadedBeans.map(bean => {
            const hasLegacyData = (bean.score && bean.score > 0) || (bean.memo && bean.memo.trim().length > 0);
            const alreadyMigrated = bean.tastingRecords?.some(r => r.id === `legacy-${bean.id}`);

            if (hasLegacyData && !alreadyMigrated) {
                const myNotesStr = bean.myNotes && bean.myNotes.length > 0
                    ? `나의 컵노트: ${bean.myNotes.join(' ')}\n`
                    : '';

                const legacyRecord: any = { // Type assertion to avoid import issues if needed, or strict Typing
                    id: `legacy-${bean.id}`,
                    // Use roastDate as default date for legacy records, or today if missing
                    date: safeDateToISOString(bean.roastDate),
                    score: bean.score || 0,
                    memo: `${myNotesStr}${bean.memo || ''}`.trim(),
                    tastingNotes: []
                };

                return {
                    ...bean,
                    tastingRecords: [...(bean.tastingRecords || []), legacyRecord],
                    // Clear legacy fields to prevent double display/migration
                    score: 0,
                    memo: '',
                    myNotes: []
                };
            }
            return bean;
        });

        if (JSON.stringify(loadedBeans) !== JSON.stringify(migratedBeans)) {
            setBeans(migratedBeans);
            storage.saveBeans(migratedBeans);
        } else {
            setBeans(loadedBeans);
        }

        setRecipes(loadedRecipes);
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
