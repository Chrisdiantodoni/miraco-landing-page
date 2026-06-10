"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/providers/AuthProvider";
import { getVouchers, MemberVoucher } from "@/lib/api/queries/voucher";
import Pagination from "@/components/Dashboard/Pagination";
import Loading from "@/components/Loader/loading";
import image from "@/public/images/miraco/logo/logo-miraco.png";

export default function VoucherList() {
  const t = useTranslations("dashboard");
  const { isAuthenticated } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [selectedVoucher, setSelectedVoucher] = useState<MemberVoucher | null>(
    null,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["memberVouchers", { search, page, perPage }],
    queryFn: () =>
      getVouchers({
        search: search || undefined,
        page,
        per_page: perPage,
      }),
    enabled: isAuthenticated,
  });

  const vouchers = (data?.data?.data || data?.data || []) as MemberVoucher[];
  const meta = data?.data?.meta || data?.data;

  return (
    <div className="dash-page-container">
      <div className="dash-table-filters">
        <input
          type="text"
          className="dash-filter-input"
          placeholder={t("voucher_search")}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          className="dash-filter-select"
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={10}>10 / {t("order_per_page")}</option>
          <option value={25}>25 / {t("order_per_page")}</option>
          <option value={50}>50 / {t("order_per_page")}</option>
        </select>
      </div>

      {isLoading ? (
        <Loading
          size="small"
          text={t("voucher_loading")}
          image={image}
          imageSize={60}
        />
      ) : isError ? (
        <div className="text-center py-5">
          <p>{t("voucher_error")}</p>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="text-center py-5">
          <p>{t("voucher_empty")}</p>
        </div>
      ) : (
        <>
          <div className="dash-vouchers-grid">
            {vouchers.map((v) => (
              <div
                key={v.id || v.voucher_code}
                className={`dash-voucher-card${v.is_terminated === 1 ? " terminated" : ""}`}
              >
                {v.is_terminated === 1 && (
                  <span className="dash-voucher-terminated-badge">
                    {t("voucher_detail_terminated")}
                  </span>
                )}
                <span className="dash-voucher-code">{v.voucher_code}</span>
                <div className="dash-voucher-discount">
                  {v.voucher?.name || "-"}
                </div>
                <div className="dash-voucher-expiry">
                  {v.voucher?.discount_type === "percentage"
                    ? `${v.voucher?.discount_value}%`
                    : v.voucher?.discount_value != null
                      ? `Rp ${v.voucher?.discount_value.toLocaleString("id-ID")}`
                      : "-"}
                </div>
                <button
                  type="button"
                  className="dash-voucher-btn"
                  onClick={() => setSelectedVoucher(v)}
                >
                  {t("voucher_detail")}
                </button>
              </div>
            ))}
          </div>

          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}

      {selectedVoucher && (
        <div
          className="dash-modal-overlay"
          onClick={() => setSelectedVoucher(null)}
        >
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="dash-modal-close"
              onClick={() => setSelectedVoucher(null)}
            >
              &times;
            </button>
            <h3 className="dash-modal-title">{selectedVoucher.voucher_code}</h3>

            <div className="dash-modal-body">
              <div className="dash-modal-row">
                <span className="dash-modal-label">
                  {t("voucher_detail_name")}
                </span>
                <span>{selectedVoucher.voucher?.name || "-"}</span>
              </div>
              <div className="dash-modal-row">
                <span className="dash-modal-label">
                  {t("voucher_detail_type")}
                </span>
                <span>
                  {selectedVoucher.voucher?.discount_type === "percentage"
                    ? t("voucher_detail_percentage")
                    : t("voucher_detail_fixed")}
                </span>
              </div>
              <div className="dash-modal-row">
                <span className="dash-modal-label">
                  {t("voucher_detail_value")}
                </span>
                <span>
                  {selectedVoucher.voucher?.discount_type === "percentage"
                    ? `${selectedVoucher.voucher?.discount_value}%`
                    : `Rp ${selectedVoucher.voucher?.discount_value?.toLocaleString("id-ID")}`}
                </span>
              </div>
              <div className="dash-modal-row">
                <span className="dash-modal-label">
                  {t("voucher_detail_description")}
                </span>
                <span>{selectedVoucher.voucher?.description || "-"}</span>
              </div>

              {(selectedVoucher.voucher?.min_transaction > 0 ||
                selectedVoucher.voucher?.min_product > 0) && (
                <>
                  <div className="dash-modal-section">
                    <h4 className="dash-modal-section-title">
                      {t("voucher_detail_requirements")}
                    </h4>
                    {selectedVoucher.voucher?.min_transaction > 0 && (
                      <div className="dash-modal-row">
                        <span className="dash-modal-label">
                          {t("voucher_detail_min_transaction")}
                        </span>
                        <span>
                          Rp{" "}
                          {selectedVoucher.voucher.min_transaction.toLocaleString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                    )}
                    {selectedVoucher.voucher?.min_product > 0 && (
                      <div className="dash-modal-row">
                        <span className="dash-modal-label">
                          {t("voucher_detail_min_product")}
                        </span>
                        <span>{selectedVoucher.voucher.min_product} items</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="dash-modal-row">
                <span className="dash-modal-label">
                  {t("voucher_detail_status")}
                </span>
                <span>
                  {selectedVoucher.is_terminated === 1
                    ? t("voucher_detail_terminated")
                    : selectedVoucher.is_pending === 1
                      ? t("voucher_detail_pending")
                      : selectedVoucher.voucher?.is_active
                        ? t("voucher_detail_active")
                        : t("voucher_detail_inactive")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
