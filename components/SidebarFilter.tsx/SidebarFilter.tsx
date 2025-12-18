/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type {
  ActiveFilters,
  Category,
  Collection,
  SubCollection,
  FilterType,
  FilterItem,
  SidebarFilterProps,
  FilterBlockProps,
} from "@/lib/types/filter";

// --- Variabel Warna ---
const $black = "#000000";

// --- Fungsi Pembantu ---
const getItemData = (
  item: Category | Collection | SubCollection,
  filterType: FilterType
): FilterItem => {
  let name: string;

  switch (filterType) {
    case "categories":
      name = (item as Category).category_name;
      break;
    case "subCollections":
      name =
        (item as Collection).collection_name ||
        (item as SubCollection).sub_collection_name;
      break;
    default:
      name = "";
  }

  return {
    id: item.id,
    name: name || `Unnamed ${filterType}`,
  };
};
const parseUrlParams = (param: string | null): (string | number)[] => {
  if (!param) return [];
  return param.split(",").map((item) => {
    const num = Number(item);
    return isNaN(num) ? item : num;
  });
};

// --- Komponen Checkbox ---
const MonokromCheckbox: React.FC<React.ComponentProps<typeof Checkbox>> = (
  props
) => (
  <Checkbox
    {...props}
    className="monokrom-checkbox"
    sx={{ color: $black, "&.Mui-checked": { color: $black } }}
  />
);

// --- Komponen FilterBlock ---
// const FilterBlock: React.FC<FilterBlockProps> = ({
//   title,
//   data,
//   filterType,
//   activeFilters,
//   handleCheckboxChange,
// }) => {
//   if (!data || data.length === 0) return null;

//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const [expanded, setExpanded] = useState<boolean>(true);

//   return (
//     <Accordion
//       expanded={expanded}
//       onChange={() => setExpanded(!expanded)}
//       className={`widget ${filterType}-widget`}
//     >
//       <AccordionSummary
//         expandIcon={<ChevronDown size={20} />}
//         aria-controls={`panel-${filterType}-content`}
//         id={`panel-${filterType}-header`}
//         className="widget-header"
//       >
//         <Typography variant="h3" component="h3" className="filter-title">
//           {title}
//         </Typography>
//       </AccordionSummary>

//       <AccordionDetails className="widget-details">
//         <List className="filter-list" disablePadding>
//           {data.map((item) => {
//             const { id: slug, name } = getItemData(item, filterType);
//             const isChecked = activeFilters[filterType].includes(slug);

//             return (
//               <ListItem key={slug} className="filter-item">
//                 <FormControlLabel
//                   className="filter-item-content"
//                   label={<span className="filter-label">{name}</span>}
//                   control={
//                     <MonokromCheckbox
//                       checked={isChecked}
//                       onChange={() => handleCheckboxChange(filterType, slug)}
//                       name={name}
//                     />
//                   }
//                 />
//               </ListItem>
//             );
//           })}
//         </List>
//       </AccordionDetails>
//     </Accordion>
//   );
// };

const FilterBlock: React.FC<
  FilterBlockProps & {
    expanded: boolean;
    onToggleExpanded: () => void;
  }
> = ({
  title,
  data,
  filterType,
  activeFilters,
  handleCheckboxChange,
  expanded,
  onToggleExpanded,
}) => {
  if (!data || data.length === 0) return null;

  // Hitung max height berdasarkan jumlah item
  const calculateMaxHeight = () => {
    const itemHeight = 40; // tinggi per item
    const maxVisibleItems = 7; // maksimal item yang terlihat
    const totalItems = data.length;

    if (totalItems <= maxVisibleItems) {
      return "auto"; // Tidak perlu scroll
    }

    return `${itemHeight * maxVisibleItems}px`; // Enable scroll
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpanded}
      className={`widget ${filterType}-widget`}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        aria-controls={`panel-${filterType}-content`}
        id={`panel-${filterType}-header`}
        className="widget-header"
      >
        <Typography variant="h3" component="h3" className="filter-title">
          {title} {data.length > 7 && `(${data.length})`}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        className="widget-details"
        sx={{
          padding: 0,
          maxHeight: calculateMaxHeight(),
          overflowY: data.length > 7 ? "auto" : "visible",
          overflowX: "hidden",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "10px",
          },
        }}
      >
        <List className="filter-list" disablePadding>
          {data.map((item) => {
            const { id: slug, name } = getItemData(item, filterType);
            const isChecked = activeFilters[filterType].includes(slug);

            return (
              <ListItem
                key={slug}
                className="filter-item"
                sx={{
                  padding: "4px 16px",
                  minHeight: "40px",
                }}
              >
                <FormControlLabel
                  className="filter-item-content"
                  label={<span className="filter-label">{name}</span>}
                  control={
                    <MonokromCheckbox
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(filterType, slug)}
                      name={name}
                    />
                  }
                  sx={{ width: "100%", margin: 0 }}
                />
              </ListItem>
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

// --- Komponen Utama SidebarFilter ---
const SidebarFilter: React.FC<SidebarFilterProps> = ({
  onFilterChange,
  collection_id,
  initialFilters, // <- Dari URL params parent
}) => {
  const settings = useSiteSettings();
  const types = settings?.categories || [];
  const [expandedSections, setExpandedSections] = useState<
    Record<FilterType, boolean>
  >({
    categories: true, // Default terbuka
    subCollections: true, // Default terbuka
  });
  // const allSubCollections =  settings?.sub_collections || [];
  const toggleExpand = useCallback((filterType: FilterType) => {
    setExpandedSections((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  }, []);

  const allSubCollections = useMemo(() => {
    const filter = settings?.sub_collections || [];
    return filter;
  }, [settings]);

  const [draftFilters, setDraftFilters] = useState<ActiveFilters>(
    initialFilters || {
      categories: [],
      subCollections: [],
    }
  );

  // // Update local state ketika initialFilters berubah (saat URL berubah dari luar)
  // useEffect(() => {
  //   if (initialFilters) {
  //     setDraftFilters(initialFilters);
  //   }
  // }, [initialFilters]);

  // Filter subCollections berdasarkan collection_id dan categories yang dipilih
  const filteredSubCollections = useMemo(() => {
    let filtered = allSubCollections.filter(
      (sub) => sub?.collection_id == collection_id
    );

    // Jika ada categories yang dipilih, filter subCollections berdasarkan category_id
    if (draftFilters.categories.length > 0) {
      filtered = filtered.filter((sub) =>
        draftFilters.categories.includes(sub.category_id)
      );
    }

    return filtered;
  }, [allSubCollections, collection_id, draftFilters.categories]);

  const activeFilterCount = useMemo(() => {
    return Object.values(draftFilters).reduce(
      (count, list) => count + list.length,
      0
    );
  }, [draftFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  const handleCheckboxChange = useCallback(
    (filterType: FilterType, slug: string | number) => {
      // Hitung filters baru di luar setState
      const currentList = draftFilters[filterType];
      const isChecked = currentList.includes(slug);

      let newSelectedList: (string | number)[];
      if (isChecked) {
        newSelectedList = currentList.filter((itemSlug) => itemSlug !== slug);
      } else {
        newSelectedList = [...currentList, slug];
      }

      let newFilters: ActiveFilters = {
        ...draftFilters,
        [filterType]: newSelectedList,
      };

      // Jika categories berubah, reset subCollections yang tidak valid
      if (filterType === "categories") {
        const validSubCollections = draftFilters.subCollections.filter(
          (subId) => {
            const subCollection = allSubCollections.find(
              (sub) => sub.id === subId
            );
            return (
              subCollection &&
              newSelectedList.includes(subCollection.category_id)
            );
          }
        );

        newFilters = {
          ...newFilters,
          subCollections: validSubCollections,
        };
      }

      // Update state
      setDraftFilters(newFilters);

      // Callback ke parent untuk update URL - SETELAH setState
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [draftFilters, onFilterChange, allSubCollections]
  );

  const resetFilters = () => {
    const emptyFilters: ActiveFilters = {
      categories: [],
      subCollections: [],
    };
    setDraftFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  return (
    <div className="blog-sidebar">
      {/* Tombol Reset di Atas */}
      <div className="filter-reset-top">
        <p className="active-filter-count" style={{ fontWeight: "bold" }}>
          {activeFilterCount} Active Filters
        </p>
        {/* <Typography
          variant="body2"
          component="p"
          className="active-filter-count"
        ></Typography> */}
        <Button
          onClick={resetFilters}
          variant="text"
          size="small"
          className="reset-button"
          disabled={!hasActiveFilters}
          sx={{
            color: $black,
            p: 0,
            minWidth: "auto",
            fontSize: "0.85rem",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
            "&.Mui-disabled": {
              color: "#aaa",
              cursor: "default",
              textDecoration: "none",
            },
          }}
        >
          <X size={14} style={{ marginRight: 4 }} />
          Clear All
        </Button>
      </div>

      {/* Filter Blocks */}
      <FilterBlock
        title="Types"
        data={types}
        filterType="categories"
        activeFilters={draftFilters}
        expanded={expandedSections.categories}
        onToggleExpanded={() => toggleExpand("categories")}
        handleCheckboxChange={handleCheckboxChange}
      />

      <FilterBlock
        title="Sub Collections"
        data={filteredSubCollections}
        filterType="subCollections"
        activeFilters={draftFilters}
        expanded={expandedSections.subCollections}
        onToggleExpanded={() => toggleExpand("subCollections")}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};

export default SidebarFilter;
