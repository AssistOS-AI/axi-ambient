let asciiLibraryCache = null;

export async function loadAsciiLibrary() {
  if (asciiLibraryCache) return asciiLibraryCache;
  const response = await fetch(new URL("./ascii-library.json", import.meta.url));
  if (!response.ok) throw new Error(`Failed to load ASCII library: ${response.status}`);
  asciiLibraryCache = await response.json();
  return asciiLibraryCache;
}

export function buildAsciiLibraryIndex(library) {
  const categories = new Map();
  for (const item of library.items || []) {
    if (!categories.has(item.category)) {
      categories.set(item.category, new Map());
    }
    const subcategories = categories.get(item.category);
    if (!subcategories.has(item.subcategory)) {
      subcategories.set(item.subcategory, []);
    }
    subcategories.get(item.subcategory).push(item);
  }

  return Array.from(categories.entries()).map(([category, subcategories]) => ({
    category,
    subcategories: Array.from(subcategories.entries()).map(([subcategory, items]) => ({
      subcategory,
      items,
    })),
  }));
}
