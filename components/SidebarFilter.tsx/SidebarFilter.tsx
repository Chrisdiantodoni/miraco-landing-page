/* eslint-disable @typescript-eslint/no-explicit-any */

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
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { ChevronDown, X } from "lucide-react";
import type {
  ActiveFilters,
  FilterType,
  FilterItem,
  SidebarFilterProps,
  FilterBlockProps,
  Category,
} from "@/lib/types/filter";
import { Type, Finishing, Size, Thickness } from "@/lib/types/master/master.d";
import { useTranslations } from "next-intl";

// --- Color Variables ---
const $black = "#000000";

// --- Extended Types ---
type SortOption = "latest" | "oldest";

interface ExtendedActiveFilters extends ActiveFilters {
  types: (string | number)[];
  finishing: (string | number)[];
  features: (string | number)[];
  is_soft_touch: boolean;
  is_anti_fingerprint: boolean;
  complementary: (string | number)[];
  is_miraedge: boolean;
  thicknesses: (string | number)[];
  sizes: (string | number)[];
}

// --- Helper Functions ---
const getItemData = (
  item: Category | Type | Size | Thickness | Finishing,
  filterType: FilterType
): FilterItem => {
  let name: string;

  switch (filterType) {
    case "features":
      name = (item as Category).category_name;
      break;
    case "types":
      name = (item as Type).type_name;
      break;
    case "sizes":
      name = (item as Size).size + " " + `(${(item as Size).size_ft} ft)`;
      break;
    case "thicknesses":
      name = (item as Thickness).thickness;
      break;
    case "finishing":
      name = (item as Finishing).finishing_name;
      break;
    default:
      name = "";
  }

  return {
    id: item.id,
    name: name || `Unnamed ${filterType}`,
  };
};

// --- Checkbox Component ---
const MonokromCheckbox: React.FC<React.ComponentProps<typeof Checkbox>> = (
  props
) => (
  <Checkbox
    {...props}
    className="monokrom-checkbox"
    sx={{ color: $black, "&.Mui-checked": { color: $black }, padding: "6px" }}
  />
);

// --- Radio Component ---
const MonokromRadio: React.FC<React.ComponentProps<typeof Radio>> = (props) => (
  <Radio
    {...props}
    sx={{ color: $black, "&.Mui-checked": { color: $black } }}
  />
);

// --- FilterBlock Component ---
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

  const calculateMaxHeight = () => {
    const itemHeight = 28;
    const maxVisibleItems = 6;
    const totalItems = data.length;

    if (totalItems <= maxVisibleItems) {
      return "auto";
    }

    return `${itemHeight * maxVisibleItems}px`;
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
          {title}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        className="widget-details"
        sx={{
          padding: 0,
          maxHeight: calculateMaxHeight(),
          overflowY: "auto",
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
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        <List className="filter-list" disablePadding>
          {data.map((item) => {
            const { id: slug, name } = getItemData(item, filterType);
            const isChecked = activeFilters[filterType]
              .map((id: any) => String(id))
              .includes(String(slug));
            return (
              <ListItem
                key={slug}
                className="filter-item"
                sx={{
                  padding: "0px 16px",
                  minHeight: "28px",
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

// --- Extended Filter Block dengan Boolean Options ---
const ExtendedFilterBlock: React.FC<{
  title: string;
  data: any[];
  filterType: FilterType;
  activeFilters: ExtendedActiveFilters;
  handleCheckboxChange: (filterType: FilterType, slug: string | number) => void;
  booleanOptions?: Array<{
    key: keyof ExtendedActiveFilters;
    label: string;
  }>;
  onBooleanChange?: (key: keyof ExtendedActiveFilters, value: boolean) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}> = ({
  title,
  data,
  filterType,
  activeFilters,
  handleCheckboxChange,
  booleanOptions = [],
  onBooleanChange,
  expanded,
  onToggleExpanded,
}) => {
  const hasData = data && data.length > 0;
  const hasBooleanOptions = booleanOptions.length > 0;

  if (!hasData && !hasBooleanOptions) return null;

  const calculateMaxHeight = () => {
    const itemHeight = 40;
    const maxVisibleItems = 6;
    const totalItems = (data?.length || 0) + booleanOptions.length;

    if (totalItems <= maxVisibleItems) {
      return "auto";
    }

    return `${itemHeight * maxVisibleItems}px`;
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
          {title} {data && data.length > 7 && `(${data.length})`}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        className="widget-details"
        sx={{
          padding: 0,
          maxHeight: calculateMaxHeight(),
          overflowY: "auto",
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
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        <List className="filter-list" disablePadding>
          {/* Render data items */}
          {hasData &&
            data.map((item) => {
              const { id: slug, name } = getItemData(item, filterType);
              // const isChecked = activeFilters[filterType].includes(slug);
              const isChecked = activeFilters[filterType]
                .map((id) => String(id))
                .includes(String(slug));
              return (
                <ListItem
                  key={slug}
                  className="filter-item"
                  sx={{
                    padding: "0px 16px",
                    minHeight: "28px",
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

          {/* Render boolean options */}
          {hasBooleanOptions &&
            booleanOptions.map((option) => {
              const isChecked = activeFilters[option.key] as boolean;

              return (
                <ListItem
                  key={option.key as string}
                  className="filter-item"
                  sx={{
                    padding: "0px 16px",
                    minHeight: "28px",
                  }}
                >
                  <FormControlLabel
                    className="filter-item-content"
                    label={<span className="filter-label">{option.label}</span>}
                    control={
                      <MonokromCheckbox
                        checked={isChecked}
                        onChange={(e) =>
                          onBooleanChange?.(option.key, e.target.checked)
                        }
                        name={option.label}
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

// --- Main SidebarFilter Component ---
const SidebarFilter: React.FC<SidebarFilterProps> = ({
  onFilterChange,
  initialFilters,
  sidebar_data,
  collection_name,
}) => {
  const settings = useSiteSettings();
  const categories =
    settings?.categories?.filter((filter) => filter?.category_name == "CORE") ||
    [];

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    types: true,
    finishing: true,
    features: true,
    complementary: true,
    sizes: true,
    thicknesses: true,
  });

  const collection = settings?.collections?.find(
    (find) => find?.collection_name?.toLowerCase() == collection_name
  )?.id as string | number;

  const allTypes = useMemo(() => {
    return sidebar_data?.types?.filter(
      (filter) => filter?.collection_id == collection
    );
  }, [sidebar_data, collection]);

  const allFinishing = useMemo(() => {
    return sidebar_data?.finishing?.filter(
      (filter) => filter?.collection_id == collection
    );
  }, [sidebar_data, collection]);

  const sizes = sidebar_data?.sizes;
  const thicknesses = sidebar_data?.thicknesses;

  const [draftFilters, setDraftFilters] = useState<ExtendedActiveFilters>({
    types: initialFilters?.types || [],
    finishing: initialFilters?.finishing || [],
    features: initialFilters?.features || [],
    is_soft_touch: initialFilters?.is_soft_touch || false,
    is_anti_fingerprint: initialFilters?.is_anti_fingerprint || false,
    complementary: initialFilters?.complementary || [],
    is_miraedge: initialFilters?.is_miraedge || false,
    thicknesses: initialFilters?.thicknesses || [],
    sizes: initialFilters?.sizes || [],
  });
  console.log(draftFilters.types, "mobile");

  const toggleExpand = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += draftFilters.types.length;
    count += draftFilters.finishing.length;
    count += draftFilters.features.length;
    count += draftFilters.complementary.length;
    count += draftFilters.thicknesses.length;
    count += draftFilters.sizes.length;
    if (draftFilters.is_soft_touch) count++;
    if (draftFilters.is_anti_fingerprint) count++;
    if (draftFilters.is_miraedge) count++;
    return count;
  }, [draftFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  const handleCheckboxChange = useCallback(
    (filterType: FilterType, slug: string | number) => {
      const currentList = draftFilters[filterType] as (string | number)[];
      const isChecked = currentList.includes(slug);

      let newSelectedList: (string | number)[];
      if (isChecked) {
        newSelectedList = currentList.filter((itemSlug) => itemSlug !== slug);
      } else {
        newSelectedList = [...currentList, slug];
      }

      const newFilters: ExtendedActiveFilters = {
        ...draftFilters,
        [filterType]: newSelectedList,
      };

      setDraftFilters(newFilters);
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [draftFilters, onFilterChange]
  );

  const handleBooleanChange = useCallback(
    (key: keyof ExtendedActiveFilters, value: boolean) => {
      const newFilters: ExtendedActiveFilters = {
        ...draftFilters,
        [key]: value,
      };

      setDraftFilters(newFilters);

      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [draftFilters, onFilterChange]
  );

  const resetFilters = () => {
    const emptyFilters: ExtendedActiveFilters = {
      types: [],
      finishing: [],
      features: [],
      is_soft_touch: false,
      is_anti_fingerprint: false,
      complementary: [],
      is_miraedge: false,
      thicknesses: [],
      sizes: [],
    };
    setDraftFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const t = useTranslations("collections");

  return (
    <div className="blog-sidebar">
      {/* Reset Button at Top */}
      <div className="filter-reset-top">
        <p className="active-filter-count" style={{ fontWeight: "normal" }}>
          {activeFilterCount} {t("active_filters")}
        </p>
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
          {t("clear_all")}
        </Button>
      </div>

      {/* Filter Blocks */}
      <FilterBlock
        title={t("label_type")}
        data={allTypes}
        filterType="types"
        activeFilters={draftFilters}
        expanded={expandedSections.types}
        onToggleExpanded={() => toggleExpand("types")}
        handleCheckboxChange={handleCheckboxChange}
      />

      <FilterBlock
        title={t("label_finish")}
        data={allFinishing}
        filterType="finishing"
        activeFilters={draftFilters}
        expanded={expandedSections.finishing}
        onToggleExpanded={() => toggleExpand("finishing")}
        handleCheckboxChange={handleCheckboxChange}
      />

      {/* Features dengan Boolean Options */}
      <ExtendedFilterBlock
        title={t("label_features")}
        data={categories}
        filterType="features"
        activeFilters={draftFilters}
        expanded={expandedSections.features}
        onToggleExpanded={() => toggleExpand("features")}
        handleCheckboxChange={handleCheckboxChange}
        booleanOptions={[
          { key: "is_soft_touch", label: "Soft Touch" },
          { key: "is_anti_fingerprint", label: "Anti Fingerprint" },
        ]}
        onBooleanChange={handleBooleanChange}
      />

      {/* Complementary dengan Boolean Option */}
      <ExtendedFilterBlock
        title={t("label_complementary")}
        data={[]} // Kosongkan jika tidak ada data array
        filterType="complementary"
        activeFilters={draftFilters}
        expanded={expandedSections.complementary}
        onToggleExpanded={() => toggleExpand("complementary")}
        handleCheckboxChange={handleCheckboxChange}
        booleanOptions={[{ key: "is_miraedge", label: "MiraEDGE" }]}
        onBooleanChange={handleBooleanChange}
      />
      <FilterBlock
        title={t("label_size")}
        data={sizes}
        filterType="sizes"
        activeFilters={draftFilters}
        expanded={expandedSections.sizes}
        onToggleExpanded={() => toggleExpand("sizes")}
        handleCheckboxChange={handleCheckboxChange}
      />
      <FilterBlock
        title={t("label_thickness")}
        data={thicknesses}
        filterType="thicknesses"
        activeFilters={draftFilters}
        expanded={expandedSections.thicknesses}
        onToggleExpanded={() => toggleExpand("thicknesses")}
        handleCheckboxChange={handleCheckboxChange}
      />

      {/* Uncomment jika ingin menambahkan Size & Thickness */}
    </div>
  );
};

export default SidebarFilter;
