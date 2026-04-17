import React from "react";

interface EmployeePaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectPage: (page: number) => void;
}

const EmployeePagination: React.FC<EmployeePaginationProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onSelectPage,
}) => {
  return (
    <div className="pagination-controls">
      <button
        type="button"
        className="pagination-btn"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;
          return (
            <button
              key={page}
              type="button"
              className={`pagination-page-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => onSelectPage(page)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pagination-btn"
        onClick={onNext}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default EmployeePagination;
