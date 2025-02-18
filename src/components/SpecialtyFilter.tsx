// src/components/SpecialtyFilter.tsx
import React from "react";
import { CheckIcon } from "lucide-react";

interface SpecialtyFilterProps {
  specialties: string[];
  selectedSpecialties: string[];
  onChange: (specialty: string) => void;
}

const styles = {
  container: "space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar",
  label:
    "flex items-center gap-3 cursor-pointer p-1.5 hover:bg-gray-50 rounded-md transition-colors",
  checkboxSelected:
    "w-5 h-5 rounded flex items-center justify-center border bg-blue-600 border-blue-600 text-white",
  checkboxUnselected:
    "w-5 h-5 rounded flex items-center justify-center border border-gray-300",
  specialtyText: "text-sm text-gray-700 flex-1 break-words",
  showMoreButton:
    "w-full text-sm text-blue-600 hover:text-blue-800 transition-colors mt-2 pt-2 border-t border-gray-100",
  selectedInfo: "text-xs text-gray-500 mt-4 pt-2 border-t border-gray-100",
  selectedCount: "font-medium",
};

export default function SpecialtyFilter({
  specialties,
  selectedSpecialties,
  onChange,
}: SpecialtyFilterProps) {
  // if there are many specialties, group them
  const isLongList = specialties.length > 15;
  const [showAll, setShowAll] = React.useState(!isLongList);
  const displayedSpecialties = showAll ? specialties : specialties.slice(0, 10);

  return (
    <div className={styles.container}>
      {displayedSpecialties.map((specialty) => (
        <label
          key={specialty}
          className={styles.label}
          onClick={(e) => {
            // prevent label's default behavior to ensure custom handler works
            e.preventDefault();
            onChange(specialty);
          }}
        >
          <div
            className={
              selectedSpecialties.includes(specialty)
                ? styles.checkboxSelected
                : styles.checkboxUnselected
            }
          >
            {selectedSpecialties.includes(specialty) && (
              <CheckIcon size={14} strokeWidth={3} />
            )}
          </div>
          <span className={styles.specialtyText}>{specialty}</span>
        </label>
      ))}

      {isLongList && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={styles.showMoreButton}
        >
          {showAll ? "Show less" : `Show all (${specialties.length})`}
        </button>
      )}

      {selectedSpecialties.length > 0 && (
        <p className={styles.selectedInfo}>
          <span className={styles.selectedCount}>
            {selectedSpecialties.length}
          </span>{" "}
          specialties selected
        </p>
      )}
    </div>
  );
}
