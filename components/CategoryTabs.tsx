
import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  const categories: Category[] = ['All', 'Favorites', 'Scheduled'];

  return (
    <div className="flex items-center space-x-3 px-6 py-4 overflow-x-auto no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border border-white/10 ${
            activeCategory === cat
              ? 'bg-white text-black border-white'
              : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;
