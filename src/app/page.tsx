// src/app/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { Suspense } from "react";
import {
  SearchIcon,
  XCircleIcon,
  FilterIcon,
  ChevronDownIcon,
  AlertCircleIcon,
} from "lucide-react";
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
    "lg:block bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit lg:sticky lg:top-6",
  sidebarHidden: "lg:block hidden",
  mobileFilterOverlay: "fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex items-center justify-center lg:hidden",
  mobileFilterContainer: "bg-white rounded-xl shadow-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto",
  sidebarHeader: "flex items-center justify-between mb-6",
  sidebarTitle: "text-xl font-semibold text-gray-900",
  closeFilterButton: "lg:hidden text-gray-500 hover:text-gray-700",
  searchContainer: "mb-8 text-sm",
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
  pageSizeContainer: "flex items-center gap-2 text-sm text-gray-700",
  pageSizeLabel: "hidden sm:inline whitespace-nowrap",
  pageSizeSelectContainer: "relative flex items-center",
  pageSizeSelect:
    "appearance-none bg-white border border-gray-300 rounded-md py-1.5 pl-3 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500",
  pageSizeIcon:
    "pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500",
  skeletonGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  emptyState: "text-center py-16 bg-gray-50 rounded-xl",
  emptyStateContent: "max-w-md mx-auto",
  emptyStateIcon: "mx-auto text-gray-300 mb-4",
  emptyStateTitle: "text-xl font-semibold text-gray-800 mb-2",
  emptyStateDescription: "text-gray-600 mb-6",
  clearButton:
    "px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",
  advocatesGrid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6",
  paginationContainer: "mt-8 mb-4",
  topPaginationContainer: "mb-6 mt-2",
  controlsContainer: "flex flex-wrap items-center justify-between gap-4",
  resultsDisplay: "flex items-center text-sm text-gray-600",
  errorContainer: "container mx-auto px-4 py-16 text-center",
  errorContent:
    "bg-red-50 border border-red-200 rounded-lg p-8 max-w-xl mx-auto",
  errorTitle: "text-2xl font-semibold text-red-700 mb-4",
  errorMessage: "text-red-600 mb-6",
  tryAgainButton:
    "px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors",
  alertBanner:
    "mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3",
  alertIcon: "flex-shrink-0 text-amber-500",
  alertMessage: "text-amber-800 text-sm",
  alertTime: "font-semibold",
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
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [allAdvocates, setAllAdvocates] = useState<Advocate[]>([]);
  const [dataStatus, setDataStatus] = useState<"live" | "cached" | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        setIsLoading(true);
        const allResponse = await fetch("/api/advocates?pageSize=100");
        if (!allResponse.ok) {
          throw new Error(`Error: ${allResponse.status}`);
        }
        const allData = await allResponse.json();
        setAllAdvocates(allData.data);

        // Check if using cached data
        if (allData.status === "cached") {
          setDataStatus("cached");
          setLastUpdated(allData.lastUpdated);
        } else {
          setDataStatus("live");
          setLastUpdated(null);
        }

        //  fetch paginated data
        const response = await fetch(
          `/api/advocates?page=${currentPage}&pageSize=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setAdvocates(data.data);
        setFilteredAdvocates(data.data);
        setTotalItems(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
        setIsLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch advocates"
        );
        setIsLoading(false);
      }
    };

    fetchAdvocates();
  }, [currentPage, itemsPerPage]);

  // getall unique specialties for filter options
  const allSpecialties = Array.from(
    new Set(allAdvocates.flatMap((advocate) => advocate.specialties))
  ).sort();

  const filterAdvocates = useCallback(
    debounce(() => {
      const filtered = allAdvocates.filter((advocate) => {
        // create fullname for combined search
        const fullName = `${advocate.firstName} ${advocate.lastName}`.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();
        
        // search term filtering
        const matchesSearch =
          searchTerm === "" ||
          fullName.includes(searchTermLower) ||
          advocate.firstName.toLowerCase().includes(searchTermLower) ||
          advocate.lastName.toLowerCase().includes(searchTermLower) ||
          advocate.city.toLowerCase().includes(searchTermLower) ||
          advocate.degree.toLowerCase().includes(searchTermLower) ||
          advocate.specialties.some((s) =>
            s.toLowerCase().includes(searchTermLower)
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

      setTotalItems(sortedResults.length);
      setTotalPages(Math.ceil(sortedResults.length / itemsPerPage));

      const startIndex = (currentPage - 1) * itemsPerPage;
      setFilteredAdvocates(
        sortedResults.slice(startIndex, startIndex + itemsPerPage)
      );

      // if current page is out of bounds after filtering, reset to pg1
      if (currentPage > Math.ceil(sortedResults.length / itemsPerPage)) {
        setCurrentPage(1);
      }
    }, 300),
    [
      allAdvocates,
      searchTerm,
      selectedSpecialties,
      sortOption,
      currentPage,
      itemsPerPage,
    ]
  );

  // trigger filtering when search, specialties, or sort changes
  useEffect(() => {
    filterAdvocates();
    return () => filterAdvocates.cancel();
  }, [
    filterAdvocates,
    searchTerm,
    selectedSpecialties,
    sortOption,
    currentPage,
    itemsPerPage,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset to 1st page when search changes
  };

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
    setCurrentPage(1); // reset to 1st page when filters change
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSortOption("default");
    setCurrentPage(1);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(1); // reset to 1st page when sort changes
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // seset to 1st page when page size changes
  };

  // toggle filter panel on mobile
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
    // prevent scrolling when filter panel is open on mobile
    if (typeof window !== 'undefined') {
      document.body.style.overflow = !showFilters ? 'hidden' : '';
    }
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const showingAllAdvocates =
    totalItems <= itemsPerPage || (startItem === 1 && endItem === totalItems);

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

  const PaginationControls = () => (
    <div className={styles.controlsContainer}>
      <div className={styles.pageSizeContainer}>
        <span className={styles.pageSizeLabel}>Show:</span>
        <div className={styles.pageSizeSelectContainer}>
          <select
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
            disabled={isLoading}
          >
            {/* todo: can update to whatever values make sense */}
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
          <ChevronDownIcon size={14} className={styles.pageSizeIcon} />
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );

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

      {/* Cached data alert banner */}
      {dataStatus === "cached" && lastUpdated && (
        <div className={styles.alertBanner} role="alert">
          <AlertCircleIcon size={20} className={styles.alertIcon} />
          <p className={styles.alertMessage}>
            Database connection failed. Showing cached data from{" "}
            <span className={styles.alertTime}>{lastUpdated}</span> ago.
          </p>
        </div>
      )}

      <div className={styles.gridLayout}>
        {/* mobile filters - centered overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto p-6">
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
                  placeholder="Search"
                  helperText="Search by name, location, or specialty"
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
            </div>
          </div>
        )}

        {/* desktop filters sidebar */}
        <aside className={`${styles.sidebar} ${!showFilters ? styles.sidebarHidden : ""}`}>
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
              placeholder="Search"
              helperText="Search by name, location, or specialty"
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
              ) : showingAllAdvocates ? (
                <>
                  Found{" "}
                  <span className={styles.resultsCountBold}>{totalItems}</span>{" "}
                  advocates
                </>
              ) : (
                <>
                  Showing{" "}
                  <span className={styles.resultsCountBold}>{startItem}</span>{" "}
                  to <span className={styles.resultsCountBold}>{endItem}</span>{" "}
                  of{" "}
                  <span className={styles.resultsCountBold}>{totalItems}</span>{" "}
                  advocates
                </>
              )}
            </p>

            <div className={styles.sortContainer}>
              <SortDropdown value={sortOption} onChange={handleSortChange} />
            </div>
          </div>

          {/* Top pagination controls */}
          {!isLoading && filteredAdvocates.length > 0 && (
            <div className={styles.topPaginationContainer}>
              <PaginationControls />
            </div>
          )}

          {/* Results grid */}
          {isLoading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: itemsPerPage < 12 ? itemsPerPage : 6 }).map(
                (_, i) => (
                  <SkeletonCard key={i} />
                )
              )}
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
                {filteredAdvocates.map((advocate) => (
                  <AdvocateCard
                    key={`${advocate.firstName}-${advocate.lastName}-${advocate.id}`}
                    advocate={advocate}
                  />
                ))}
              </div>

              {/* Bottom pagination */}
              {filteredAdvocates.length > 0 && (
                <div className={styles.paginationContainer}>
                  <PaginationControls />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
