// src/app/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Suspense } from "react";
import { SearchIcon, XCircleIcon, FilterIcon } from "lucide-react";
import Image from "next/image";
import { debounce } from "lodash";

// Components
import AdvocateCard from "@/components/AdvocateCard";
import SearchInput from "@/components/SearchInput";
import SpecialtyFilter from "@/components/SpecialtyFilter";
import Pagination from "@/components/Pagination";
import SkeletonCard from "@/components/SkeletonCard";
import SortDropdown from "@/components/SortDropdown";
import { Advocate } from "@/types/advocate";

const styles = {
  container: "container mx-auto px-4 py-8 max-w-7xl",
  header: "mb-12",
  headerFlex: "flex items-center justify-between mb-6",
  pageTitle: "text-3xl md:text-4xl font-bold text-gray-900 font-brand",
  mobileFilterButton:
    "md:hidden flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md",
  pageDescription: "text-xl text-gray-600 max-w-2xl",
  gridLayout: "grid grid-cols-1 lg:grid-cols-4 gap-8",
  sidebar:
    "lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6",
  sidebarHidden: "hidden",
  sidebarHeader: "flex items-center justify-between mb-6",
  sidebarTitle: "text-xl font-semibold text-gray-900",
  closeFilterButton: "lg:hidden text-gray-500 hover:text-gray-700",
  searchContainer: "mb-8",
  specialtiesContainer: "mb-8",
  specialtiesTitle: "text-lg font-medium text-gray-900 mb-4",
  clearFiltersContainer: "mt-6 pt-6 border-t border-gray-100",
  clearFiltersButton:
    "w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors flex items-center justify-center gap-2",
  mainContent: "lg:col-span-3",
  resultsHeader: "flex flex-wrap items-center justify-between mb-6 gap-4",
  resultsCount: "text-gray-700",
  resultsCountBold: "font-semibold",
  sortContainer: "flex items-center gap-3",
  skeletonGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  emptyState: "text-center py-16 bg-gray-50 rounded-xl",
  emptyStateContent: "max-w-md mx-auto",
  emptyStateIcon: "mx-auto text-gray-300 mb-4",
  emptyStateTitle: "text-xl font-semibold text-gray-800 mb-2",
  emptyStateDescription: "text-gray-600 mb-6",
  clearButton:
    "px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
  advocatesGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  paginationContainer: "mt-12",
  errorContainer: "container mx-auto px-4 py-16 text-center",
  errorContent:
    "bg-red-50 border border-red-200 rounded-lg p-8 max-w-xl mx-auto",
  errorTitle: "text-2xl font-semibold text-red-700 mb-4",
  errorMessage: "text-red-600 mb-6",
  tryAgainButton:
    "px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors",
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // calculate pagination values
  const totalPages = Math.ceil(filteredAdvocates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAdvocates = filteredAdvocates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/advocates");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setAdvocates(data.data);
        setFilteredAdvocates(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch advocates"
        );
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, []);

  // Extract all unique specialties for filter options
  const allSpecialties = Array.from(
    new Set(advocates.flatMap((advocate) => advocate.specialties))
  ).sort();

  const filterAdvocates = useCallback(
    debounce(() => {
      const filtered = advocates.filter((advocate) => {
        // search term filtering
        const matchesSearch =
          searchTerm === "" ||
          advocate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
          advocate.specialties.some((s) =>
            s.toLowerCase().includes(searchTerm.toLowerCase())
          );

        //specialty filtering
        const matchesSpecialties =
          selectedSpecialties.length === 0 ||
          selectedSpecialties.every((specialty) =>
            advocate.specialties.includes(specialty)
          );

        return matchesSearch && matchesSpecialties;
      });

      // sort the filtered results
      let sortedResults = [...filtered];
      switch (sortOption) {
        case "experience-high":
          sortedResults.sort(
            (a, b) => b.yearsOfExperience - a.yearsOfExperience
          );
          break;
        case "experience-low":
          sortedResults.sort(
            (a, b) => a.yearsOfExperience - b.yearsOfExperience
          );
          break;
        case "name-asc":
          sortedResults.sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`
            )
          );
          break;
        case "name-desc":
          sortedResults.sort((a, b) =>
            `${b.firstName} ${b.lastName}`.localeCompare(
              `${a.firstName} ${a.lastName}`
            )
          );
          break;
        default:
          break;
      }

      setFilteredAdvocates(sortedResults);
      setCurrentPage(1); // Reset to first page when filters change
    }, 300),
    [advocates, searchTerm, selectedSpecialties, sortOption]
  );

  // trigger filtering when search, specialties, or sort changes
  useEffect(() => {
    filterAdvocates();
    return () => filterAdvocates.cancel();
  }, [filterAdvocates, searchTerm, selectedSpecialties, sortOption]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSortOption("default");
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  // toggle filter panel on mobile
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.tryAgainButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerFlex}>
          <h1 className={styles.pageTitle}>Find Your Perfect Advocate</h1>
          <button onClick={toggleFilters} className={styles.mobileFilterButton}>
            <FilterIcon size={18} />
            Filters
          </button>
        </div>
        <p className={styles.pageDescription}>
          Connect with healthcare advocates matched to your specific needs and
          preferences.
        </p>
      </header>

      <div className={styles.gridLayout}>
        {/* Filters sidebar - desktop */}
        <aside
          className={`${styles.sidebar} ${
            !showFilters ? styles.sidebarHidden : ""
          }`}
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>Filters</h2>
            <button
              onClick={toggleFilters}
              className={styles.closeFilterButton}
            >
              <XCircleIcon size={20} />
            </button>
          </div>

          <div className={styles.searchContainer}>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, location, specialty..."
            />
          </div>

          <div className={styles.specialtiesContainer}>
            <h3 className={styles.specialtiesTitle}>Specialties</h3>
            <SpecialtyFilter
              specialties={allSpecialties}
              selectedSpecialties={selectedSpecialties}
              onChange={handleSpecialtyChange}
            />
          </div>

          {(searchTerm ||
            selectedSpecialties.length > 0 ||
            sortOption !== "default") && (
            <div className={styles.clearFiltersContainer}>
              <button
                onClick={resetFilters}
                className={styles.clearFiltersButton}
              >
                <XCircleIcon size={16} />
                Clear all filters
              </button>
            </div>
          )}
        </aside>

        {/* Main content area */}
        <div className={styles.mainContent}>
          {/* Results header */}
          <div className={styles.resultsHeader}>
            <p className={styles.resultsCount}>
              {isLoading ? (
                "Loading results..."
              ) : (
                <>
                  Showing{" "}
                  <span className={styles.resultsCountBold}>
                    {filteredAdvocates.length}
                  </span>{" "}
                  advocates
                </>
              )}
            </p>

            <div className={styles.sortContainer}>
              <SortDropdown value={sortOption} onChange={handleSortChange} />
            </div>
          </div>

          {/* Results grid */}
          {isLoading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredAdvocates.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateContent}>
                <SearchIcon size={48} className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>No matches found</h3>
                <p className={styles.emptyStateDescription}>
                  We could not find any advocates matching your search criteria.
                  Try adjusting your filters.
                </p>
                <button onClick={resetFilters} className={styles.clearButton}>
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.advocatesGrid}>
                {paginatedAdvocates.map((advocate) => (
                  <AdvocateCard
                    key={`${advocate.firstName}-${advocate.lastName}-${advocate.id}`}
                    advocate={advocate}
                  />
                ))}
              </div>

              {/* Pagination */}
              {filteredAdvocates.length > itemsPerPage && (
                <div className={styles.paginationContainer}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
