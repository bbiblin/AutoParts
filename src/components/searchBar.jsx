
export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Buscar productos por nombre o código..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-darBlue"
      />
    </div>
  );
}
