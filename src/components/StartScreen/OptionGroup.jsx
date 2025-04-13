function OptionGroup({ title, options, selected, onSelect, format = (v) => v }) {
    return (
      <div>
        <h4>{title}</h4>
        {options.map((option) => (
          <button
            key={option.id || option}
            className={
                selected === option || (typeof option === "object" && selected?.id === option.id)
                  ? "active"
                  : ""
              }
            onClick={() => onSelect(option)}
          >
            {format(option)}
          </button>
        ))}
      </div>
    );
  }
  
export default OptionGroup;
  