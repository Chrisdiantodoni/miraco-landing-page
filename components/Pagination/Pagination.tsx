/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginationMeta } from "@/lib/types/pagination";
// Import/Definisikan tipe Product jika ini adalah komponen spesifik
// Jika Anda ingin ini menjadi komponen generik, gunakan <T>

// Definisikan Tipe Generic untuk Komponen
// T adalah tipe data untuk item yang dipaginasi (misalnya: Product, User, dll.)
export default function Pagination<T>({
  paginationData,
  onPageChange,
  maxVisiblePages = 5,
}: // maxVisiblePages = 5, // maxVisiblePages tidak digunakan dalam logika, bisa dihapus atau diimplementasikan
{
  // Gunakan PaginationMeta<T> untuk memastikan tipe data benar
  paginationData: any;
  onPageChange: (page: number) => void; // Tambahkan tipe untuk onPageChange
  maxVisiblePages?: number; // Tambahkan kembali jika ingin digunakan
}) {
  // Validate pagination data
  if (!paginationData) {
    return null;
  }

  console.log({ paginationData });

  // Karena sekarang menggunakan Generic <T>, kita tidak perlu lagi eslint-disable @typescript-eslint/no-explicit-any
  // Anda bisa menghapus eslint-disable @typescript-eslint/no-explicit-any dari bagian atas file jika ini adalah satu-satunya alasan.

  const { current_page, last_page, total } = paginationData;

  // Jika hanya 1 halaman, tidak perlu tampilkan pagination
  if (last_page <= 1) {
    return null;
  }

  // ... (Logika getVisiblePages tetap sama)
  const maxVisiblePagesActual = maxVisiblePages || 5;

  const getVisiblePages = () => {
    let start = Math.max(
      1,
      current_page - Math.floor(maxVisiblePagesActual / 2)
    );
    const end = Math.min(last_page, start + maxVisiblePagesActual - 1);

    // Adjust start jika end terlalu dekat dengan last_page
    if (end - start + 1 < maxVisiblePagesActual) {
      start = Math.max(1, end - maxVisiblePagesActual + 1);
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
