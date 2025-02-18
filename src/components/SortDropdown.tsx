// src/components/SortDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, ArrowUpDownIcon } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const styles = {
  container: "relative",
  button:
    "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors",
  chevron: "transition-transform",
  chevronRotated: "transition-transform rotate-180",
  dropdown:
    "absolute right-0 z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg",
  optionsList: "py-1",
  optionBase: "px-4 py-2 cursor-pointer hover:bg-gray-50",
  optionSelected:
    "px-4 py-2 cursor-pointer hover:bg-gray-50 bg-blue-50 text-blue-700",
  optionUnselected: "px-4 py-2 cursor-pointer hover:bg-gray-50 text-gray-700",
};

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: "default", label: "Default" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "experience-high", label: "Most experienced" },
    { value: "experience-low", label: "Newly certified" },
  ];

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.button}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ArrowUpDownIcon size={16} />
        <span>Sort: {selectedOption.label}</span>
        <ChevronDownIcon
          size={16}
          className={isOpen ? styles.chevronRotated : styles.chevron}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <ul role="listbox" className={styles.optionsList}>
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={
                  value === option.value
                    ? styles.optionSelected
                    : styles.optionUnselected
                }
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
