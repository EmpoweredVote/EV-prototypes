import React, { useState } from 'react';
import { ChevronRight, ArrowLeft, Home, Shield, Flame, Hammer, GraduationCap, Heart, Building2, BookOpen, Dumbbell, Cpu, Users, Building, Landmark, Recycle, Trash2, Palette, Briefcase, Zap, TrendingUp, Navigation } from 'lucide-react';

// Icon mapping for budget categories
const categoryIcons = {
  'Community': Users,
  'Capital Outlays': Building,
  'Urban Redevelopment': Landmark,
  'Debt Service': Recycle,
  'Sanitation': Trash2,
  'Culture and Recreation': Palette,
  'General Government': Briefcase,
  'Public Safety': Shield,
  'Utilities': Zap,
  'Sustainable & Economic': TrendingUp,
  'Highway and Streets': Navigation,
  // Fallback for demo data
  'Police Department': Shield,
  'Fire Department': Flame,
  'Public Works': Hammer,
  'Education': GraduationCap,
  'Health Services': Heart,
  'Administration': Building2,
  'Library Services': BookOpen,
  'Recreation': Dumbbell,
  'Technology': Cpu,
};

// Sample budget data
const budgetData = [
  {
    name: 'Police Department',
    amount: 2500000,
    percentage: 35,
    color: '#3b82f6',
    subcategories: [
      { name: 'Sworn Officers', amount: 1500000, percentage: 60, color: '#2563eb' },
      { name: 'Civilian Staff', amount: 500000, percentage: 20, color: '#60a5fa' },
      { name: 'Equipment', amount: 300000, percentage: 12, color: '#93c5fd' },
      { name: 'Training', amount: 200000, percentage: 8, color: '#bfdbfe' }
    ]
  },
  {
    name: 'Fire Department',
    amount: 1800000,
    percentage: 25.2,
    color: '#ef4444',
    subcategories: [
      { name: 'Firefighters', amount: 1200000, percentage: 66.7, color: '#dc2626' },
      { name: 'Equipment', amount: 400000, percentage: 22.2, color: '#f87171' },
      { name: 'Training', amount: 200000, percentage: 11.1, color: '#fca5a5' }
    ]
  },
  {
    name: 'Public Works',
    amount: 1200000,
    percentage: 16.8,
    color: '#10b981',
    subcategories: [
      { name: 'Road Maintenance', amount: 600000, percentage: 50, color: '#059669' },
      { name: 'Water & Sewer', amount: 400000, percentage: 33.3, color: '#34d399' },
      { name: 'Parks', amount: 200000, percentage: 16.7, color: '#6ee7b7' }
    ]
  },
  {
    name: 'Education',
    amount: 800000,
    percentage: 11.2,
    color: '#8b5cf6',
    subcategories: [
      { name: 'Teacher Salaries', amount: 500000, percentage: 62.5, color: '#7c3aed' },
      { name: 'Supplies', amount: 200000, percentage: 25, color: '#a78bfa' },
      { name: 'Facilities', amount: 100000, percentage: 12.5, color: '#c4b5fd' }
    ]
  },
  {
    name: 'Health Services',
    amount: 450000,
    percentage: 6.3,
    color: '#f59e0b',
    subcategories: [
      { name: 'Clinics', amount: 300000, percentage: 66.7, color: '#d97706' },
      { name: 'Programs', amount: 150000, percentage: 33.3, color: '#fbbf24' }
    ]
  },
  {
    name: 'Administration',
    amount: 250000,
    percentage: 3.5,
    color: '#6366f1',
    subcategories: [
      { name: 'Salaries', amount: 150000, percentage: 60, color: '#4f46e5' },
      { name: 'Operations', amount: 100000, percentage: 40, color: '#818cf8' }
    ]
  },
  {
    name: 'Library Services',
    amount: 80000,
    percentage: 1.1,
    color: '#ec4899',
    subcategories: [
      { name: 'Books & Media', amount: 50000, percentage: 62.5, color: '#db2777' },
      { name: 'Staff', amount: 30000, percentage: 37.5, color: '#f472b6' }
    ]
  },
  {
    name: 'Recreation',
    amount: 50000,
    percentage: 0.7,
    color: '#14b8a6',
    subcategories: [
      { name: 'Programs', amount: 30000, percentage: 60, color: '#0d9488' },
      { name: 'Facilities', amount: 20000, percentage: 40, color: '#2dd4bf' }
    ]
  },
  {
    name: 'Technology',
    amount: 20000,
    percentage: 0.2,
    color: '#a855f7',
    subcategories: [
      { name: 'Infrastructure', amount: 15000, percentage: 75, color: '#9333ea' },
      { name: 'Support', amount: 5000, percentage: 25, color: '#c084fc' }
    ]
  }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

const getCategoryIcon = (categoryName) => {
  const IconComponent = categoryIcons[categoryName] || Building2;
  return IconComponent;
};

const ProportionalBar = ({ categories, highlightIndex = null }) => {
  return (
    <div 
      className="flex w-full rounded-lg overflow-hidden shadow-sm"
      style={{ height: '100px' }}
      role="img"
      aria-label={`Budget allocation bar chart showing ${categories.length} categories`}
    >
      {categories.map((category, index) => (
        <div
          key={index}
          style={{
            width: `${category.percentage}%`,
            backgroundColor: category.color,
            opacity: highlightIndex !== null && highlightIndex !== index ? 0.3 : 1,
            transition: 'opacity 0.3s ease'
          }}
          className="relative"
          title={`${category.name}: ${formatCurrency(category.amount)} (${category.percentage}%)`}
        >
          {category.percentage >= 8 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
              <span className="text-white text-sm font-bold text-center drop-shadow">
                {formatCurrency(category.amount)}
              </span>
              <span className="text-white text-xs text-center drop-shadow opacity-90">
                ({category.percentage}%)
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const CategoryButton = ({ category, onClick, showArrow = true }) => {
  const IconComponent = getCategoryIcon(category.name);
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left relative overflow-hidden hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-200 active:scale-[0.98]"
      style={{ minHeight: '72px' }}
      aria-label={`${category.name}, ${formatCurrency(category.amount)}, ${category.percentage}% ${showArrow ? ', tap to explore' : ''}`}
    >
      {/* Background bar filling the button */}
      <div 
        className="absolute top-0 left-0 h-full transition-all duration-300"
        style={{
          width: `${category.percentage}%`,
          backgroundColor: category.color,
          opacity: 0.08
        }}
      />
      
      {/* Content layer */}
      <div className="relative px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Icon */}
          <div 
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: category.color }}
            aria-hidden="true"
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          
          {/* Category info */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-lg mb-1">
              {category.name}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-3">
              <span className="font-medium">{formatCurrency(category.amount)}</span>
              <span className="text-gray-400">•</span>
              <span>{category.percentage}%</span>
            </div>
          </div>
          
          {/* Arrow indicator */}
          {showArrow && (
            <ChevronRight className="flex-shrink-0 w-6 h-6 text-gray-400" />
          )}
        </div>
      </div>
    </button>
  );
};

const Breadcrumbs = ({ path, onNavigate }) => {
  return (
    <nav className="flex items-center gap-2 text-sm mb-4" aria-label="Breadcrumb">
      <button
        onClick={() => onNavigate([])}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
        aria-label="Return to overview"
      >
        <Home className="w-4 h-4" />
        <span className="font-medium">Overview</span>
      </button>
      
      {path.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button
            onClick={() => onNavigate(path.slice(0, index + 1))}
            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            aria-current={index === path.length - 1 ? "page" : undefined}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

const BudgetVisualization = () => {
  const [navigationPath, setNavigationPath] = useState([]);
  
  const totalBudget = budgetData.reduce((sum, cat) => sum + cat.amount, 0);
  
  // Determine what to display
  const currentLevel = navigationPath.length === 0 
    ? { categories: budgetData, title: 'City Budget Overview', total: totalBudget }
    : { 
        categories: navigationPath[navigationPath.length - 1].subcategories || [], 
        title: navigationPath[navigationPath.length - 1].name,
        total: navigationPath[navigationPath.length - 1].amount
      };
  
  // Get parent category for comparison bars
  const parentCategory = navigationPath.length > 0 ? navigationPath[navigationPath.length - 1] : null;
  const handleCategoryClick = (category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setNavigationPath([...navigationPath, category]);
    }
  };
  
  const handleBack = () => {
    setNavigationPath(navigationPath.slice(0, -1));
  };
  
  const hasSubcategories = (category) => {
    return category.subcategories && category.subcategories.length > 0;
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          City Budget Explorer
        </h1>
        <p className="text-lg text-gray-600">
          Total Budget: <span className="font-semibold text-gray-900">{formatCurrency(totalBudget)}</span>
        </p>
      </div>
      
      {/* Breadcrumbs */}
      {navigationPath.length > 0 && (
        <Breadcrumbs path={navigationPath} onNavigate={setNavigationPath} />
      )}
      
      {/* Back button (alternative to breadcrumbs for mobile) */}
      {navigationPath.length > 0 && (
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg px-4 py-2 font-medium"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to {navigationPath.length === 1 ? 'Overview' : navigationPath[navigationPath.length - 2].name}
        </button>
      )}
      
      {/* Current level header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {currentLevel.title}
        </h2>
        <p className="text-gray-600">
          {formatCurrency(currentLevel.total)} 
          {navigationPath.length > 0 && (
            <span> • {navigationPath[navigationPath.length - 1].percentage}% of total budget</span>
          )}
        </p>
      </div>
      
      {/* Visual proportional bar */}
      <div className="mb-6">
        <ProportionalBar categories={currentLevel.categories} />
      </div>
      
      {/* Category list */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          {currentLevel.categories.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              <p className="text-lg mb-2">No subcategories available</p>
              <p className="text-sm">This is a leaf category with no further breakdown.</p>
            </div>
          ) : (
            currentLevel.categories.map((category, index) => (
              <CategoryButton
                key={index}
                category={category}
                onClick={() => handleCategoryClick(category)}
                showArrow={hasSubcategories(category)}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Help text */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Tip:</strong> {navigationPath.length === 0 
            ? 'Tap any department to explore how its budget is allocated. The colored background shows its relative size.'
            : 'The colored background shows each subcategory\'s size relative to the parent category.'
          }
        </p>
      </div>
      
      {/* Stats summary */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {currentLevel.categories.length} {currentLevel.categories.length === 1 ? 'category' : 'categories'}
        {navigationPath.length > 0 && (
          <span> in {currentLevel.title}</span>
        )}
      </div>
    </div>
  );
};

export default BudgetVisualization;