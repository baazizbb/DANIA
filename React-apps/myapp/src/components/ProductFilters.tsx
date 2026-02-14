import { useEffect, useMemo, useState } from "react";

type PriceRange = "all" | "0-149" | "150-299" | "300-449" | "450+";

interface ProductFiltersProps {
  categories: string[];
  subcategories: string[];
  brands: string[];
  colors: string[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedBrands: string[];
  selectedColors: string[];
  selectedPriceRange: PriceRange;
  selectedMinRating: number;
  onToggleCategory: (value: string) => void;
  onToggleSubcategory: (value: string) => void;
  onToggleBrand: (value: string) => void;
  onToggleColor: (value: string) => void;
  onPriceRangeChange: (value: PriceRange) => void;
  onMinRatingChange: (value: number) => void;
  onClear: () => void;
}

interface FilterGroupProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

function FilterGroup({ title, options, selectedValues, onToggle }: FilterGroupProps) {
  return (
    <div className="filter-group">
      <h3>{title}</h3>
      <div className="filter-options">
        {options.map((option) => (
          <label key={option} className="filter-check">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => onToggle(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function ProductFilters({
  categories,
  subcategories,
  brands,
  colors,
  selectedCategories,
  selectedSubcategories,
  selectedBrands,
  selectedColors,
  selectedPriceRange,
  selectedMinRating,
  onToggleCategory,
  onToggleSubcategory,
  onToggleBrand,
  onToggleColor,
  onPriceRangeChange,
  onMinRatingChange,
  onClear,
}: ProductFiltersProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!mobileFiltersOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileFiltersOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileFiltersOpen]);

  const priceRanges: { label: string; value: PriceRange }[] = [
    { label: "All prices", value: "all" },
    { label: "$0 - $149", value: "0-149" },
    { label: "$150 - $299", value: "150-299" },
    { label: "$300 - $449", value: "300-449" },
    { label: "$450+", value: "450+" },
  ];

  const activeFiltersCount = useMemo(() => {
    let count =
      selectedCategories.length +
      selectedSubcategories.length +
      selectedBrands.length +
      selectedColors.length;

    if (selectedPriceRange !== "all") {
      count += 1;
    }

    if (selectedMinRating > 0) {
      count += 1;
    }

    return count;
  }, [
    selectedBrands.length,
    selectedCategories.length,
    selectedColors.length,
    selectedMinRating,
    selectedPriceRange,
    selectedSubcategories.length,
  ]);

  return (
    <>
      <div className="filters-mobile-toggle-wrap">
        <button
          type="button"
          className="filters-mobile-toggle"
          onClick={() => setMobileFiltersOpen((prev) => !prev)}
          aria-expanded={mobileFiltersOpen}
          aria-controls="products-filters-panel"
        >
          {mobileFiltersOpen ? "Hide Filters" : "Show Filters"}
          <span>{activeFiltersCount}</span>
        </button>
      </div>

      <button
        type="button"
        className={`filters-drawer-backdrop ${mobileFiltersOpen ? "is-open" : ""}`}
        aria-label="Close filters"
        onClick={() => setMobileFiltersOpen(false)}
      />

      <aside
        id="products-filters-panel"
        className={`products-filters-column ${mobileFiltersOpen ? "is-open" : ""}`}
      >
        <div className="filters-header">
          <h2>Filter Products</h2>
          <div className="filters-actions">
            <button
              type="button"
              className="filters-mobile-close"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              X
            </button>
            <button type="button" onClick={onClear}>
              Clear
            </button>
          </div>
        </div>

        <FilterGroup
          title="Categories"
          options={categories}
          selectedValues={selectedCategories}
          onToggle={onToggleCategory}
        />

        <FilterGroup
          title="Subcategories"
          options={subcategories}
          selectedValues={selectedSubcategories}
          onToggle={onToggleSubcategory}
        />

        <FilterGroup
          title="Brands"
          options={brands}
          selectedValues={selectedBrands}
          onToggle={onToggleBrand}
        />

        <FilterGroup
          title="Colors"
          options={colors}
          selectedValues={selectedColors}
          onToggle={onToggleColor}
        />

        <div className="filter-group">
          <h3>Price</h3>
          <div className="filter-options">
            {priceRanges.map((range) => (
              <label key={range.value} className="filter-check">
                <input
                  type="radio"
                  name="price-range"
                  checked={selectedPriceRange === range.value}
                  onChange={() => onPriceRangeChange(range.value)}
                />
                <span>{range.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Rating</h3>
          <div className="filter-options">
            {[0, 3, 4, 5].map((rating) => (
              <label key={rating} className="filter-check">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedMinRating === rating}
                  onChange={() => onMinRatingChange(rating)}
                />
                <span>{rating === 0 ? "All ratings" : `${rating}+ stars`}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
