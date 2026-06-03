type Filter = {
  label: string;
  options: string[];
};

type FilterBarProps = {
  filters: Filter[];
};

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <section className="filters-panel" aria-label="Dashboard filters">
      {filters.map((filter) => (
        <div className="filter-control" key={filter.label}>
          <label htmlFor={filter.label}>{filter.label}</label>
          <select id={filter.label}>
            {filter.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}

      <button className="reset-button">Reset Filters</button>
    </section>
  );
}
