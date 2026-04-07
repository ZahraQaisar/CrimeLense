import React from 'react';

const ChipGroup = ({
  chips = [],
  selected,
  onSelect,
  multi = false,
  maxSelect = 3,
}) => {
  const isSelected = (chip) => {
    if (multi) return Array.isArray(selected) && selected.includes(chip);
    return selected === chip;
  };

  const handleClick = (chip) => {
    if (multi) {
      const curr = Array.isArray(selected) ? selected : [];
      if (curr.includes(chip)) {
        onSelect(curr.filter(c => c !== chip));
      } else if (curr.length < maxSelect) {
        onSelect([...curr, chip]);
      }
    } else {
      onSelect(chip);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const active = isSelected(chip);
        return (
          <button
            key={chip}
            type="button"
            onClick={() => handleClick(chip)}
            className="text-xs font-medium rounded-lg px-3 py-1.5 transition-all duration-150"
            style={{
              background: active ? 'var(--accent-dim)' : 'var(--border-subtle)',
              border: active ? '1px solid var(--accent-border)' : '1px solid var(--border-subtle)',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              transform: active ? 'translateY(-1px)' : 'translateY(0)',
            }}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
};

export default ChipGroup;
