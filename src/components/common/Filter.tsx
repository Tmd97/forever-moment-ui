import { useState, useRef, useEffect } from 'react';
import { Search, X, ListFilter } from 'lucide-react';
import { cn } from '@/utils/cn';
import './Filter.scss';

export interface FilterOption {
    id: string;
    label: string;
    value: string;
}

export interface FilterCategory {
    id: string;
    name: string;
    options: FilterOption[];
}

interface FilterProps {
    categories: FilterCategory[];
    onFilterChange?: (selectedFilters: Record<string, string[]>) => void;
    disabled?: boolean;
    className?: string;
}

export const Filter: React.FC<FilterProps> = ({
    categories,
    onFilterChange,
    disabled = false,
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || '');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);

    const totalCount = Object.values(selectedFilters).reduce((sum, arr) => sum + arr.length, 0);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggleFilter = (categoryId: string, optionValue: string) => {
        const newFilters = { ...selectedFilters };

        if (!newFilters[categoryId]) {
            newFilters[categoryId] = [];
        }

        const index = newFilters[categoryId].indexOf(optionValue);
        if (index > -1) {
            newFilters[categoryId] = newFilters[categoryId].filter(v => v !== optionValue);
            if (newFilters[categoryId].length === 0) {
                delete newFilters[categoryId];
            }
        } else {
            newFilters[categoryId].push(optionValue);
        }

        setSelectedFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const handleClearFilters = () => {
        setSelectedFilters({});
        onFilterChange?.({});
    };

    const currentCategory = categories.find(cat => cat.id === selectedCategory);
    const filteredOptions = currentCategory?.options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className={cn("filter-container-div", className)} ref={filterRef}>
            <button
                className="filter-open-btn"
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X size={16} className="filter-icon" />
                ) : (
                    <ListFilter size={16} className="filter-icon" />
                )}
                <span className="filter-open-btn-text">
                    Filters{' '}
                    {totalCount > 0 && (
                        <span className="count-circle">
                            <span className="filter-count">{totalCount}</span>
                        </span>
                    )}
                </span>
            </button>

            {isOpen && (
                <div className="filter-panel">
                    <div className="filter-panel-header">
                        <h3>Filters</h3>
                        {totalCount > 0 && (
                            <button className="clear-filter" onClick={handleClearFilters}>
                                Clear all
                                <span className="count-circle">
                                    <span className="filter-count">{totalCount}</span>
                                </span>
                            </button>
                        )}
                    </div>

                    <div className="filter-panel-content">
                        <div className="filters-headers-container">
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    className={cn(
                                        'filter-header-title',
                                        selectedCategory === category.id && 'filter-active'
                                    )}
                                >
                                    <button
                                        className="filter-name-btn"
                                        onClick={() => {
                                            setSelectedCategory(category.id);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <span className="filter-name-text">{category.name}</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="filters-data-container">
                            <div className="search-box-container">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <Search size={16} className="search-icon" />
                            </div>

                            <div className="check-boxes-container">
                                {filteredOptions.map(option => (
                                    <div key={option.id} className="checkbox-div">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters[selectedCategory]?.includes(option.value) || false}
                                                onChange={() => handleToggleFilter(selectedCategory, option.value)}
                                            />
                                            <span className="checkbox-text">{option.label}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
