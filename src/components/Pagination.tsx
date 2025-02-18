// src/components/Pagination.tsx
import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const styles = {
  nav: "flex justify-center",
  list: "flex items-center gap-1",
  prevBtnDisabled: "p-2 rounded-md text-gray-300 cursor-not-allowed",
  prevBtnEnabled: "p-2 rounded-md text-gray-600 hover:bg-gray-100",
  ellipsis: "px-2 py-1 text-gray-500",
  pageBtn: "w-9 h-9 rounded-md text-gray-700 hover:bg-gray-100",
  pageBtnActive: "w-9 h-9 rounded-md bg-blue-600 text-white font-medium",
  nextBtnDisabled: "p-2 rounded-md text-gray-300 cursor-not-allowed",
  nextBtnEnabled: "p-2 rounded-md text-gray-600 hover:bg-gray-100",
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // generate page numbers to display
  const getPageNumbers = () => {
    // always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;
    let pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // If 7 or fewer pages, show all of them
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // always include first page, last page, and the current page.
      // use "..." when there are gaps
      if (currentPage <= 3) {
        // near start: show 1, 2, 3, 4, 5, ..., lastPage
        pages = [1, 2, 3, 4, 5, "...", lastPage];
      } else if (currentPage >= totalPages - 2) {
        // near end: show 1, ..., lastPage-4, lastPage-3, lastPage-2, lastPage-1, lastPage
        pages = [
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        // middle: show 1, .., currentPage-1, currentPage, currentPage+1, ..., lastPage
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          lastPage,
        ];
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <ul className={styles.list}>
        {/* prev button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={
              currentPage === 1 ? styles.prevBtnDisabled : styles.prevBtnEnabled
            }
            aria-label="Previous page"
          >
            <ChevronLeftIcon size={18} />
          </button>
        </li>

        {/* page numbers */}
        {pages.map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className={styles.ellipsis}>...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={
                  currentPage === page ? styles.pageBtnActive : styles.pageBtn
                }
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? styles.nextBtnDisabled
                : styles.nextBtnEnabled
            }
            aria-label="Next page"
          >
            <ChevronRightIcon size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
}
