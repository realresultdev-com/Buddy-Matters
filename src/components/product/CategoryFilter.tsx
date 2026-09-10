import type { Category } from "../../types/product.types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory("")}
        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === ""
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
            : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
        }`}
      >
        All Products
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === cat.id
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
