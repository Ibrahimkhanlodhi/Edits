// components/FilterSelector.tsx
import React from 'react';

type FilterOption = {
  name: string;
  ffmpegValue: string;
};

const filters: FilterOption[] = [
  { name: 'None', ffmpegValue: '' },
  { name: 'Grayscale', ffmpegValue: 'hue=s=0' },
  { name: 'Invert', ffmpegValue: 'negate' },
  { name: 'Blur', ffmpegValue: 'boxblur=5:1' },
  { name: 'Contrast + Brightness', ffmpegValue: 'eq=contrast=1.5:brightness=0.05' },
];

interface Props {
  selected: string;
  onChange: (filter: string) => void;
}

const FilterSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="font-semibold">Choose Filter</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2 w-full"
      >
        {filters.map((f) => (
          <option key={f.name} value={f.ffmpegValue}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterSelector;
