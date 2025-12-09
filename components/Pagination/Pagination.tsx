import { PaginationProps } from "@/lib/types/pagination";

export default function Pagination({
  paginationData,
  onPageChange,
  maxVisiblePages = 5,
}: PaginationProps) {
  // Validate pagination data
  if (!paginationData || !paginationData.meta) {
    return null;
  }

  const { current_page, last_page, total, per_page } = paginationData.meta;

  // Jika hanya 1 halaman, tidak perlu tampilkan pagination
  if (last_page <= 1) {
    return null;
  }

  /**
   * Generate array halaman yang ditampilkan
   * Misal: current=5, last=10, maxVisible=5
   * Tampilkan: [3, 4, 5, 6, 7]
   */
  const getVisiblePages = () => {
    let start = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
    const end = Math.min(last_page, start + maxVisiblePages - 1);

    // Adjust start jika end terlalu dekat dengan last_page
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="pagination-wrapper pagination-wrapper-center">
      <ul className="pg-pagination">
        {/* Previous Button */}
        <li>
          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={current_page === 1}
            title="Previous page"
          >
            <i className="ti-angle-left"></i>
          </button>
        </li>

        {/* First Page + Dots (jika perlu) */}
        {visiblePages[0] > 1 && (
          <>
            <li>
              <button onClick={() => onPageChange(1)}>1</button>
            </li>
            {visiblePages[0] > 2 && (
              <li className="dots d-flex justify-content-center align-items-center">
                <span>...</span>
              </li>
            )}
          </>
        )}

        {/* Visible Pages */}
        {visiblePages.map((page) => (
          <li key={page} className={current_page === page ? "active" : ""}>
            <button onClick={() => onPageChange(page)}>{page}</button>
          </li>
        ))}

        {/* Last Page + Dots (jika perlu) */}
        {visiblePages[visiblePages.length - 1] < last_page && (
          <>
            {visiblePages[visiblePages.length - 1] < last_page - 1 && (
              <li className="dots d-flex justify-content-center align-items-center">
                <span>...</span>
              </li>
            )}
            <li>
              <button onClick={() => onPageChange(last_page)}>
                {last_page}
              </button>
            </li>
          </>
        )}

        {/* Next Button */}
        <li>
          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={current_page === last_page}
            title="Next page"
          >
            <i className="ti-angle-right"></i>
          </button>
        </li>
      </ul>

      {/* Optional: Page Info */}
      <div
        className="pagination-info"
        style={{ marginTop: "1rem", textAlign: "center" }}
      >
        <small>
          Page {current_page} of {last_page} ({total} total items)
        </small>
      </div>
    </div>
  );
}
