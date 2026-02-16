import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type SyntheticEvent,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCartShopping,
  faGrip,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import ProductFilters from "../components/ProductFilters";
import "./Products.css";

type ProductCategory = "Chair" | "Table" | "Sofa" | "Storage";
type ProductSubcategory =
  | "Office Chair"
  | "Dining Chair"
  | "Coffee Table"
  | "Desk Table"
  | "Sectional Sofa"
  | "Loveseat"
  | "Cabinet"
  | "Shelf";
type ProductBrand = "Mameri" | "NovaHome" | "UrbanNest" | "WoodLine";
type ProductColor = "Black" | "White" | "Brown" | "Gray" | "Blue";
type PriceRange = "all" | "0-149" | "150-299" | "300-449" | "450+";
type ProductBadge = "SALE" | "NEW" | "HOT";
type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";
type ViewMode = "grid" | "list";

interface Product {
  sku: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  brand: ProductBrand;
  color: ProductColor;
  image: string;
  badges?: ProductBadge[];
  rating: number;
  reviews: number;
}

const IMAGE_BASE = "http://185.185.80.116/images/desk";
const IMAGE_FALLBACK = "http://185.185.80.116/images/product-holder/product-placeholder01.png";

const products: Product[] = [
  {
    sku: "MAM-001",
    name: "Nordic Accent Chair",
    price: 129,
    oldPrice: 169,
    category: "Chair",
    subcategory: "Office Chair",
    brand: "Mameri",
    color: "Black",
    image: "http://185.185.80.116/images/desk/01.jpg",
    badges: ["HOT"],
    rating: 4,
    reviews: 21,
  },
  {
    sku: "MAM-002",
    name: "Cloud Lounge Chair importation ref 008 fabrication artisanal en algerie",
    price: 149,
    oldPrice: 189,
    category: "Chair",
    subcategory: "Dining Chair",
    brand: "NovaHome",
    color: "Gray",
    image: `${IMAGE_BASE}/02.jpg`,
    badges: ["NEW"],
    rating: 5,
    reviews: 12,
  },
  {
    sku: "MAM-003",
    name: "Minimal Round Table",
    price: 219,
    oldPrice: 269,
    category: "Table",
    subcategory: "Coffee Table",
    brand: "UrbanNest",
    color: "Brown",
    image: `${IMAGE_BASE}/03.jpg`,
    badges: ["SALE"],
    rating: 4,
    reviews: 18,
  },
  {
    sku: "MAM-004",
    name: "Contempo Side Table",
    price: 159,
    category: "Table",
    subcategory: "Desk Table",
    brand: "WoodLine",
    color: "White",
    image: `${IMAGE_BASE}/04.jpg`,
    badges: ["HOT"],
    rating: 4,
    reviews: 9,
  },
  {
    sku: "MAM-005",
    name: "Metro Two-Seat Sofa",
    price: 399,
    oldPrice: 499,
    category: "Sofa",
    subcategory: "Loveseat",
    brand: "Mameri",
    color: "Blue",
    image: `${IMAGE_BASE}/05.jpg`,
    badges: ["SALE", "HOT"],
    rating: 5,
    reviews: 33,
  },
  {
    sku: "MAM-006",
    name: "Urban Comfort Sofa",
    price: 429,
    category: "Sofa",
    subcategory: "Sectional Sofa",
    brand: "UrbanNest",
    color: "Gray",
    image: `${IMAGE_BASE}/06.jpg`,
    rating: 4,
    reviews: 15,
  },
  {
    sku: "MAM-007",
    name: "Slim Storage Cabinet",
    price: 289,
    oldPrice: 349,
    category: "Storage",
    subcategory: "Cabinet",
    brand: "WoodLine",
    color: "Brown",
    image: `${IMAGE_BASE}/07.jpg`,
    badges: ["SALE"],
    rating: 4,
    reviews: 14,
  },
  {
    sku: "MAM-008",
    name: "Oak Display Unit",
    price: 309,
    category: "Storage",
    subcategory: "Shelf",
    brand: "NovaHome",
    color: "White",
    image: `${IMAGE_BASE}/08.jpg`,
    badges: ["HOT"],
    rating: 5,
    reviews: 27,
  },
  {
    sku: "MAM-009",
    name: "Classic Reading Chair",
    price: 139,
    category: "Chair",
    subcategory: "Office Chair",
    brand: "UrbanNest",
    color: "Black",
    image: `${IMAGE_BASE}/09.jpg`,
    rating: 3,
    reviews: 8,
  },
  {
    sku: "MAM-010",
    name: "Premium Media Console",
    price: 259,
    oldPrice: 329,
    category: "Storage",
    subcategory: "Cabinet",
    brand: "Mameri",
    color: "Gray",
    image: `${IMAGE_BASE}/10.jpg`,
    badges: ["NEW"],
    rating: 4,
    reviews: 19,
  },
  {
    sku: "MAM-011",
    name: "Signature Living Set",
    price: 499,
    oldPrice: 619,
    category: "Sofa",
    subcategory: "Sectional Sofa",
    brand: "WoodLine",
    color: "Blue",
    image: `${IMAGE_BASE}/11.jpg`,
    badges: ["SALE", "HOT"],
    rating: 5,
    reviews: 41,
  },
  {
    sku: "MAM-012",
    name: "Compact Console Table",
    price: 179,
    oldPrice: 215,
    category: "Table",
    subcategory: "Desk Table",
    brand: "NovaHome",
    color: "Brown",
    image: `${IMAGE_BASE}/12.jpg`,
    badges: ["SALE"],
    rating: 4,
    reviews: 16,
  },
];

export default function Products() {
  const [searchText, setSearchText] = useState("");
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showLimit, setShowLimit] = useState<number>(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<ProductSubcategory[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<ProductBrand[]>([]);
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>("all");
  const [selectedMinRating, setSelectedMinRating] = useState(0);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    []
  );
  const subcategories = useMemo(
    () => [...new Set(products.map((product) => product.subcategory))],
    []
  );
  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))], []);
  const colors = useMemo(() => [...new Set(products.map((product) => product.color))], []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    const isPriceMatch = (price: number) => {
      switch (selectedPriceRange) {
        case "0-149":
          return price <= 149;
        case "150-299":
          return price >= 150 && price <= 299;
        case "300-449":
          return price >= 300 && price <= 449;
        case "450+":
          return price >= 450;
        default:
          return true;
      }
    };

    return products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const subcategoryMatch =
        selectedSubcategories.length === 0 ||
        selectedSubcategories.includes(product.subcategory);
      const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
      const ratingMatch = selectedMinRating === 0 || product.rating >= selectedMinRating;
      const searchMatch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch);
      const priceMatch = isPriceMatch(product.price);

      return (
        categoryMatch &&
        subcategoryMatch &&
        brandMatch &&
        colorMatch &&
        ratingMatch &&
        searchMatch &&
        priceMatch
      );
    });
  }, [
    searchText,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    selectedColors,
    selectedPriceRange,
    selectedMinRating,
  ]);

  const sortedProducts = useMemo(() => {
    const clone = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        clone.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        clone.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        clone.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return clone;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / showLimit));
  const safePage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safePage - 1) * showLimit;
  const displayedProducts = sortedProducts.slice(pageStartIndex, pageStartIndex + showLimit);
  const start = sortedProducts.length > 0 ? pageStartIndex + 1 : 0;
  const end = pageStartIndex + displayedProducts.length;

  const toggleListValue = <T extends string>(
    value: T,
    setter: Dispatch<SetStateAction<T[]>>
  ) => {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedPriceRange("all");
    setSelectedMinRating(0);
    setSearchText("");
    setCurrentPage(1);
  };

  const handleAddToCart = (productSku: string) => {
    if (!addedIds.includes(productSku)) {
      setAddedIds((prev) => [...prev, productSku]);
      return;
    }

    setAddedIds((prev) => prev.filter((id) => id !== productSku));
  };

  const handleImageError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    const imageElement = event.currentTarget;

    if (imageElement.dataset.fallbackApplied === "true") {
      return;
    }

    imageElement.dataset.fallbackApplied = "true";
    imageElement.src = IMAGE_FALLBACK;
  };

  return (
    <div className="products-page">
      <section className="products-content">
        <ProductFilters
          categories={categories}
          subcategories={subcategories}
          brands={brands}
          colors={colors}
          selectedCategories={selectedCategories}
          selectedSubcategories={selectedSubcategories}
          selectedBrands={selectedBrands}
          selectedColors={selectedColors}
          selectedPriceRange={selectedPriceRange}
          selectedMinRating={selectedMinRating}
          onToggleCategory={(value) =>
            toggleListValue(value as ProductCategory, setSelectedCategories)
          }
          onToggleSubcategory={(value) =>
            toggleListValue(value as ProductSubcategory, setSelectedSubcategories)
          }
          onToggleBrand={(value) => toggleListValue(value as ProductBrand, setSelectedBrands)}
          onToggleColor={(value) => toggleListValue(value as ProductColor, setSelectedColors)}
          onPriceRangeChange={(value) => {
            setSelectedPriceRange(value);
            setCurrentPage(1);
          }}
          onMinRatingChange={(value) => {
            setSelectedMinRating(value);
            setCurrentPage(1);
          }}
          onClear={clearFilters}
        />

        <div className="products-main">
          <section className="products-toolbar">
            <div className="toolbar-left">
              <div className="view-switches" aria-label="View options">
                <button
                  type="button"
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  onClick={() => setViewMode("grid")}
                >
                  <FontAwesomeIcon icon={faGrip} />
                </button>
                <button
                  type="button"
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  onClick={() => setViewMode("list")}
                >
                  <FontAwesomeIcon icon={faBars} />
                </button>
              </div>

              <p className="results-copy">
                Showing {start}-{end} of {sortedProducts.length} products
              </p>
            </div>

            <div className="toolbar-right">
              <input
                type="text"
                placeholder="Search by name or ID"
                value={searchText}
                onChange={(event) => {
                  setSearchText(event.target.value);
                  setCurrentPage(1);
                }}
                className="products-search"
              />

              <label className="toolbar-select-wrap">
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="toolbar-select"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </label>

              <label className="toolbar-select-wrap">
                <span>Per page:</span>
                <select
                  value={showLimit}
                  onChange={(event) => {
                    setShowLimit(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="toolbar-select toolbar-select-small"
                >
                  <option value={6}>6</option>
                  <option value={9}>9</option>
                  <option value={12}>12</option>
                </select>
              </label>
            </div>
          </section>

          <section className="products-grid-section">
            {sortedProducts.length === 0 ? (
              <p className="empty-state">No products match this filter.</p>
            ) : (
              <>
                {viewMode === "list" ? (
                  <div className="products-list-head" aria-hidden="true">
                    <span>Image</span>
                    <span>SKU</span>
                    <span>Product</span>
                    <span>Rating</span>
                    <span>Price</span>
                    <span />
                  </div>
                ) : null}

                <div className={`products-grid ${viewMode === "list" ? "list-view" : ""}`}>
                  {displayedProducts.map((product) => {
                    const isAdded = addedIds.includes(product.sku);

                    if (viewMode === "list") {
                      return (
                        <article key={product.sku} className="product-card product-card-list">
                          <div className="list-cell list-cell-image">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-image"
                              loading="lazy"
                              onError={handleImageError}
                            />
                          </div>

                          <p className="list-cell list-cell-sku">{product.sku}</p>

                          <div className="list-cell list-cell-product">
                            <div className="product-badges-inline">
                              {product.badges?.map((badge) => (
                                <span
                                  key={`${product.sku}-${badge}`}
                                  className={`product-badge-inline ${badge.toLowerCase()}`}
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                            <h3 className="product-name">{product.name}</h3>
                          </div>

                          <div
                            className="list-cell list-cell-rating"
                            aria-label={`${product.rating} out of 5 stars`}
                          >
                            <div className="product-stars">
                              {Array.from({ length: 5 }, (_, index) => (
                                <FontAwesomeIcon
                                  key={`${product.sku}-star-${index}`}
                                  icon={faStar}
                                  className={index < product.rating ? "is-filled" : "is-empty"}
                                />
                              ))}
                            </div>
                            <span className="product-reviews">{product.reviews} reviews</span>
                          </div>

                          <div className="list-cell list-cell-price">
                            <span className="price-current">${product.price.toFixed(2)}</span>
                            {product.oldPrice ? (
                              <span className="price-old">${product.oldPrice.toFixed(2)}</span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            className={`add-cart-btn list-cell list-cell-cart ${isAdded ? "added" : ""}`}
                            onClick={() => handleAddToCart(product.sku)}
                            aria-label={isAdded ? "Remove from cart" : "Add to cart"}
                          >
                            <FontAwesomeIcon icon={faCartShopping} />
                          </button>
                        </article>
                      );
                    }

                    return (
                      <article key={product.sku} className="product-card">
                        <div className="product-image-wrap">
                          <button type="button" className="quickview-btn" aria-label="Quick view">
                            []
                          </button>
                          <div className="product-badges">
                            {product.badges?.map((badge) => (
                              <span
                                key={`${product.sku}-${badge}`}
                                className={`product-badge ${badge.toLowerCase()}`}
                              >
                                {badge}
                              </span>
                            ))}
                          </div>

                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                            loading="lazy"
                            onError={handleImageError}
                          />
                        </div>

                        <div className="product-info">
                          <p className="product-id">SKU: {product.sku}</p>
                          <h3 className="product-name">{product.name}</h3>

                          <p className="product-rating" aria-label={`${product.rating} out of 5 stars`}>
                            <span className="product-stars">
                              {Array.from({ length: 5 }, (_, index) => (
                                <FontAwesomeIcon
                                  key={`${product.sku}-grid-star-${index}`}
                                  icon={faStar}
                                  className={index < product.rating ? "is-filled" : "is-empty"}
                                />
                              ))}
                            </span>
                            <span className="product-reviews">{product.reviews} reviews</span>
                          </p>

                          <div className="product-prices">
                            <span className="price-current">${product.price.toFixed(2)}</span>
                            {product.oldPrice ? (
                              <span className="price-old">${product.oldPrice.toFixed(2)}</span>
                            ) : null}
                          </div>

                          <button
                            type="button"
                            className={`add-cart-btn ${isAdded ? "added" : ""}`}
                            onClick={() => handleAddToCart(product.sku)}
                            aria-label={isAdded ? "Remove from cart" : "Add to cart"}
                          >
                            <FontAwesomeIcon icon={faCartShopping} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          {sortedProducts.length > 0 ? (
            <nav className="pagination" aria-label="Products pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={safePage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  className={page === safePage ? "active" : ""}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safePage === totalPages}
              >
                Next
              </button>
            </nav>
          ) : null}
        </div>
      </section>
    </div>
  );
}
