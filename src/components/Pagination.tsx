import React from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  queryParams?: Record<string, any>;
  onPageChange: (page: number) => void;
  section: 'superadmin' | 'admin' | 'user';
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  queryParams = {},
  onPageChange,
  section,
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  const createLink = (page: number) => {
    const updatedQueryParams = { ...queryParams, page };
    const queryString = new URLSearchParams(updatedQueryParams).toString();
    return `/${section}/users?${queryString}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Previous */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white cursor'
        }`}
      >
        &laquo; Previous
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            disabled={isActive}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-1 rounded border ${
              isActive
                ? 'bg-blue-600 text-white font-bold cursor-not-allowed'
                : 'bg-white text-blue-600 border-blue-400 cursor'
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white cursor'
        }`}
      >
        Next &raquo;
      </button>
    </div>
  );
};

export default Pagination;
