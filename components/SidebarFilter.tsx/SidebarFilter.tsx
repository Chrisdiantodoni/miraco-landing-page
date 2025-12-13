"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useSiteSettings } from "@/lib/providers/SiteSettingProvider";
// Import komponen MUI yang diperlukan
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

// --- Variabel Warna ---
const $black = "#000000";

// --- Fungsi Pembantu Tetap Sama ---

const getItemData = (item, filterType) => {
  let name;
  switch (filterType) {
    case "categories":
    case "types":
      name = item.category_name;
      break;
    case "collections":
    case "subCollections":
      name = item.collection_name || item.sub_collection_name;
      break;
    default:
      name = "";
  }
  return { id: item.id, name: name || `Unnamed ${filterType}` };
};

// --- Komponen Checkbox ---
const MonokromCheckbox = (props) => (
  <Checkbox
    {...props}
    className="monokrom-checkbox"
    sx={{ color: $black, "&.Mui-checked": { color: $black } }}
  />
);

// -------------------------------------------------------------------
// Komponen Pembantu FilterBlock (Menggunakan className)
// -------------------------------------------------------------------

const FilterBlock = ({
  title,
  data,
  filterType,
  activeFilters,
  handleCheckboxChange,
}) => {
  if (!data || data.length === 0) return null;

  const [expanded, setExpanded] = useState(true);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      className={`widget ${filterType}-widget`}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        aria-controls={`panel-${filterType}-content`}
        id={`panel-${filterType}-header`}
        className="widget-header"
      >
        <Typography variant="h3" component="h3" className="filter-title">
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails className="widget-details">
        <List className="filter-list" disablePadding>
          {data.map((item) => {
            const { id: slug, name } = getItemData(item, filterType);
            const isChecked = activeFilters[filterType].includes(slug);

            return (
              <ListItem key={slug} className="filter-item">
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
                />
              </ListItem>
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

// -----------------------------------------------------
// Komponen Utama SidebarFilter
// -----------------------------------------------------

const SidebarFilter = ({ onFilterChange }) => {
  const settings = useSiteSettings();

  const types = settings?.categories || [];
  const collections = settings?.collections || [];
  const subCollections = settings?.sub_collections || [];

  const [draftFilters, setDraftFilters] = useState({
    categories: [],
    types: [],
    collections: [],
    subCollections: [],
  });

  const activeFilterCount = useMemo(() => {
    return Object.values(draftFilters).reduce(
      (count, list) => count + list.length,
      0
    );
  }, [draftFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  const handleCheckboxChange = useCallback(
    (filterType, slug) => {
      setDraftFilters((prev) => {
        const currentList = prev[filterType];
        const isChecked = currentList.includes(slug);

        let newSelectedList;
        if (isChecked) {
          newSelectedList = currentList.filter((itemSlug) => itemSlug !== slug);
        } else {
          newSelectedList = [...currentList, slug];
        }

        const newFilters = {
          ...prev,
          [filterType]: newSelectedList,
        };

        if (onFilterChange) {
          onFilterChange(newFilters);
        }

        return newFilters;
      });
    },
    [onFilterChange]
  );

  const resetFilters = () => {
    const emptyFilters = {
      categories: [],
      types: [],
      collections: [],
      subCollections: [],
    };
    setDraftFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  return (
    <div className="blog-sidebar">
      {/* 1. Tombol Reset di Atas (Selalu Ada, Disabled jika kosong) */}
      <div className="filter-reset-top">
        <Typography
          variant="body2"
          component="p"
          className="active-filter-count"
        >
          {activeFilterCount} Active Filters
        </Typography>
        <Button
          onClick={resetFilters}
          variant="text"
          size="small"
          className="reset-button"
          disabled={!hasActiveFilters} // Disabled jika tidak ada filter
          sx={{
            color: $black,
            p: 0,
            minWidth: "auto",
            fontSize: "0.85rem",
            fontWeight: 600,

            // Gaya hover dan disabled untuk visual yang lebih baik
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
            "&.Mui-disabled": {
              color: "#aaa", // Warna abu-abu saat disabled
              cursor: "default",
              textDecoration: "none",
            },
          }}
        >
          <X size={14} style={{ marginRight: 4 }} />
          Clear All
        </Button>
      </div>

      {/* 2. Filter Blocks */}
      <FilterBlock
        title="Types"
        data={types}
        filterType="types"
        activeFilters={draftFilters}
        handleCheckboxChange={handleCheckboxChange}
      />

      <FilterBlock
        title="Sub Collections"
        data={subCollections}
        filterType="subCollections"
        activeFilters={draftFilters}
        handleCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};

export default SidebarFilter;
