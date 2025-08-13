
import React, { useState, useMemo, useCallback } from "react";
import { Searchable, FilterCriteria, QueryOptions } from "@/types/search";
import { queryEngine } from "@/services/FilterService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import FilterPanel from "@/components/filters/FilterPanel";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { Filter } from "lucide-react";

interface DataViewProps<T extends Searchable> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  searchPlaceholder: string;
  showFilters?: boolean;
}

const itemsPerPageOptions = [10, 20, 50, 100];

const generatePagination = (currentPage: number, pageCount: number, isMobile: boolean): (number | string)[] => {
  if (pageCount <= 1) return pageCount === 1 ? [1] : [];

  const delta = isMobile ? 1 : 2;
  const pages = new Set<number>();

  pages.add(1);
  if (pageCount > 1) {
    pages.add(pageCount);
  }

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < pageCount) {
      pages.add(i);
    }
  }

  if (currentPage > 1) pages.add(currentPage);
  if (currentPage < pageCount) pages.add(currentPage);

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const result: (number | string)[] = [];
  let lastPage: number | null = null;

  for (const page of sortedPages) {
    if (lastPage !== null && page - lastPage > 1) {
      result.push("...");
    }
    result.push(page);
    lastPage = page;
  }

  return result;
};

const DataView = <T extends Searchable> ({
  items,
  renderItem,
  searchPlaceholder,
  showFilters = true
}: DataViewProps<T>) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterCriteria[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Execute query using QueryEngine
  const queryResult = useMemo(() => {
    const queryOptions: QueryOptions = {
      searchTerm,
      filters,
      sortBy: "rating",
      sortOrder: "desc"
    };
    return queryEngine.executeQuery(items, queryOptions);
  }, [items, searchTerm, filters]);

  // Pagination calculation
  const pageCount = Math.ceil(queryResult.items.length / itemsPerPage);

  // Reset to first page on itemsPerPage or search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, searchTerm, filters]);

  const paginatedItems = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return queryResult.items.slice(startIdx, startIdx + itemsPerPage);
  }, [queryResult.items, currentPage, itemsPerPage]);

  const paginationRange = useMemo(() => {
    return generatePagination(currentPage, pageCount, isMobile);
  }, [currentPage, pageCount, isMobile]);

  // Pagination navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pageCount) setCurrentPage(page);
  };

  // Info text
  const showingFrom = queryResult.items.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, queryResult.items.length);

  const handleFiltersChange = useCallback((newFilters: FilterCriteria[]) => {
    console.log("DataView: Filters changed", newFilters);
    setFilters(newFilters);
  }, []);

  return (
    <div className="content-with-pagination">
      {/* Search bar and filter button */}
      <div className="bg-white px-4 py-3 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-3 pr-3 py-2 border rounded-md w-full shadow-sm focus:outline-none focus:ring-2 text-sm"
            />
          </div>
          {showFilters && (
            <button
              onClick={() => setIsFilterPanelOpen(true)}
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <Filter className="w-4 h-4"/>
              {filters.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                  {filters.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results info */}
      <div className="px-4 py-2 text-xs text-gray-500 flex-shrink-0">
        {queryResult.items.length > 0
          ? t("showingItems",
            {
              from: showingFrom,
              to: showingTo,
              total: queryResult.items.length,
              defaultValue: `Showing ${showingFrom}–${showingTo} of ${queryResult.items.length} products`
            }
          )
          : t("noResults", "No products found")}
      </div>

      {/* Scrollable item list - Now properly sized */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {paginatedItems.map(renderItem)}
            {paginatedItems.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8">
                <div className="text-gray-500 text-center">
                  <p className="text-sm mb-2">{t("noResultsFound")}</p>
                  <p className="text-xs">{t("tryDifferentSearchOrFilters")}</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Fixed Pagination controls */}
      <div className="pagination-fixed flex justify-between items-center px-4 gap-2 flex-row bg-white border-t">
        <Pagination className="flex items-center gap-2 flex-1">
          <PaginationContent>
            {/* Previous Button */}
            <PaginationItem>
              <PaginationPrevious
                aria-label={t("previousPage", "Previous page")}
                onClick={() => goToPage(currentPage - 1)}
                tabIndex={currentPage === 1 ? -1 : 0}
                aria-disabled={currentPage === 1}
                style={currentPage === 1 ? { opacity: 0.5, pointerEvents: "none" } : {}}
                size="sm"
                className="px-2 h-7 md:h-8"
              >
                <span className="hidden md:inline">{t("previous", "Previous")}</span>
              </PaginationPrevious>
            </PaginationItem>

            {paginationRange.map((page, index) => {
              if (typeof page === "string") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis className="h-7 w-6 md:h-8 md:w-8"/>
                  </PaginationItem>
                );
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    aria-label={t("goToPage", { page, defaultValue: `Go to page ${page}` })}
                    onClick={() => goToPage(page)}
                    size="icon"
                    className="text-xs w-7 h-7 md:w-8 md:h-8"
                    style={pageCount <= 1 ? { pointerEvents: "none" } : {}}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                aria-label={t("nextPage", "Next page")}
                onClick={() => goToPage(currentPage + 1)}
                tabIndex={currentPage >= pageCount ? -1 : 0}
                aria-disabled={currentPage >= pageCount}
                style={currentPage >= pageCount ? { opacity: 0.5, pointerEvents: "none" } : {}}
                size="sm"
                className="px-2 h-7 md:h-8"
              >
                <span className="hidden md:inline">{t("next", "Next")}</span>
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>

          {/* Items per page selector */}
          <div className="flex items-center gap-2 ml-4">
            <label htmlFor="itemsPerPage" className="text-xs text-gray-500 hidden md:inline">
              {t("itemsPerPage", "Items per page")}:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={e => setItemsPerPage(Number(e.target.value))}
              className="border rounded text-sm px-2 py-1"
            >
              {itemsPerPageOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </Pagination>
      </div>

      {/* Full-screen Filter Panel */}
      {showFilters && isFilterPanelOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <FilterPanel
            isOpen={true}
            onToggle={() => setIsFilterPanelOpen(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            appliedCount={filters.length}
          />
        </div>
      )}
    </div>
  );
};

export default DataView;
