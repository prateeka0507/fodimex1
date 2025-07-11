export default function SearchFilterBar({ search, category, onSearch, onCategoryChange, categories }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-4">
      <input
        type="text"
        value={search}
        onChange={e => onSearch(e.target.value)}
        placeholder="Search products..."
        className="border rounded px-3 py-2 w-full md:w-1/3"
      />
      <select
        value={category}
        onChange={e => onCategoryChange(e.target.value)}
        className="border rounded px-3 py-2 w-full md:w-1/4"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
} 