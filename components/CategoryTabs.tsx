
import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  isDarkMode: boolean;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange, isDarkMode }) => {
  const categories: Category[] = ['All', 'Favorites', 'Scheduled'];
  return (
    <nav className="flex items-center space-x-2 px-6 py-6 overflow-x-auto no-scrollbar" aria-label="Project categories" role="tablist">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${cat}`}
            onClick={() => onCategoryChange(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isActive
                ? isDarkMode 
                  ? 'bg-white text-black border-white shadow-[0_8px_20px_-4px_rgba(255,255,255,0.2)]' 
                  : 'bg-black text-white border-black shadow-[0_8px_20px_-4px_rgba(0,0,0,0.2)]'
                : isDarkMode 
                  ? 'text-white/20 border-white/[0.05] hover:text-white/50 hover:border-white/10' 
                  : 'text-black/20 border-black/[0.05] hover:text-black/50 hover:border-black/10'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </nav>
  );
};

export default CategoryTabs;
