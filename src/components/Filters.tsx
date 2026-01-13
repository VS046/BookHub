function Filters({ setSort, setFilter }) {
  return (
    <div className="filters">
      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort By</option>
        <option value="title">Title A-Z</option>
        <option value="new">Newest</option>
        <option value="old">Oldest</option>
      </select>

      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">Filter</option>
        <option value="author">Has Author</option>
        <option value="cover">Has Cover</option>
      </select>
    </div>
  );
}

export default Filters;
