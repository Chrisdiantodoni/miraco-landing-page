"use client";
import React, { useState, useCallback, useMemo } from "react";
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
const FilterBlock: React.FC<FilterBlockProps> = ({
  title,
  data,
  filterType,
  activeFilters,
  handleCheckboxChange,
}) => {
  if (!data || data.length === 0) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [expanded, setExpanded] = useState<boolean>(true);

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

// --- Komponen Utama SidebarFilter ---
const SidebarFilter: React.FC<SidebarFilterProps> = ({
  onFilterChange,
  collection_id,
}) => {
  const settings = useSiteSettings();

  const types = settings?.categories || [];
  const subCollections =
    settings?.sub_collections?.filter(
      (filter) => filter?.collection_id == collection_id
    ) || [];

  const [draftFilters, setDraftFilters] = useState<ActiveFilters>({
    categories: [],
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
    (filterType: FilterType, slug: string | number) => {
      setDraftFilters((prev) => {
        const currentList = prev[filterType];
        const isChecked = currentList.includes(slug);

        let newSelectedList: (string | number)[];
        if (isChecked) {
          newSelectedList = currentList.filter((itemSlug) => itemSlug !== slug);
        } else {
          newSelectedList = [...currentList, slug];
        }

        const newFilters: ActiveFilters = {
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
