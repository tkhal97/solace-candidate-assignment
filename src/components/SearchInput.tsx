// src/components/SearchInput.tsx
import React from "react";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  helperText?: string;
}

const styles = {
  container: "relative",
  iconContainer:
    "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none",
  searchIcon: "w-5 h-5 text-gray-400",
  input:
    "block w-full pl-10 pr-10 py-2.5 text-gray-900 bg-white border border-gray-200 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
  clearButton:
    "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600",
  clearIcon: "w-5 h-5",
  helperText: "mt-1.5 text-xs text-gray-500"
};

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  helperText
}: SearchInputProps) {
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <SearchIcon className={styles.searchIcon} />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={styles.input}
          placeholder={placeholder}
        />
        {value && (
          <button
            className={styles.clearButton}
            onClick={() => {
              const inputEvent = {
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>;
              onChange(inputEvent);
            }}
          >
            <XIcon className={styles.clearIcon} />
          </button>
        )}
      </div>
      {helperText && (
        <p className={styles.helperText}>{helperText}</p>
      )}
    </div>
  );
}