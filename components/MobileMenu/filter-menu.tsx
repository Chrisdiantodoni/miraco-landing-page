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
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
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

// --- Color Variables ---
const $black = "#000000";

// --- Extended Types ---
type SortOption = "latest" | "oldest";

interface ExtendedActiveFilters extends ActiveFilters {
  sortBy: SortOption;
  sort_by: "new" | "";
  newOnly: boolean;
}

// --- Helper Functions ---
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

// --- Checkbox Component ---
const MonokromCheckbox: React.FC<React.ComponentProps<typeof Checkbox>> = (
  props
) => (
  <Checkbox
    {...props}
    className="monokrom-checkbox"
    sx={{ color: $black, "&.Mui-checked": { color: $black } }}
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
    const itemHeight = 40;
    const maxVisibleItems = 7;
    const totalItems = data.length;

    if (totalItems <= maxVisibleItems) {
      return "auto";
    }

    return `${itemHeight * maxVisibleItems}px`;
  };

  const shouldShowScroll = data.length > 7;

  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpanded}
      className={`widget ${filterType}-widget`}
      sx={{
        boxShadow: "none",
        "&:before": { display: "none" },
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        aria-controls={`panel-${filterType}-content`}
        id={`panel-${filterType}-header`}
        className="widget-header"
      >
        <Typography
          variant="h3"
          component="h3"
          className="filter-title"
          sx={{ fontSize: "1rem", fontWeight: 600 }}
        >
          {title} {data.length > 7 && `(${data.length})`}
        </Typography>
      </AccordionSummary>

      <AccordionDetails
        className="widget-details"
        sx={{
          padding: 0,
          maxHeight: shouldShowScroll ? calculateMaxHeight() : "auto",
          overflowY: shouldShowScroll ? "auto" : "visible",
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

// --- Sort Block Component ---
const SortBlock: React.FC<{
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}> = ({ sortBy, onSortChange, expanded, onToggleExpanded }) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpanded}
      className="widget sort-widget"
      sx={{
        boxShadow: "none",
        "&:before": { display: "none" },
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        aria-controls="panel-sort-content"
        id="panel-sort-header"
        className="widget-header"
      >
        <Typography
          variant="h3"
          component="h3"
          className="filter-title"
          sx={{ fontSize: "1rem", fontWeight: 600 }}
        >
          Sort By
        </Typography>
      </AccordionSummary>

      <AccordionDetails className="widget-details" sx={{ padding: 0 }}>
        <List className="filter-list" disablePadding>
          <RadioGroup
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            sx={{ width: "100%" }}
          >
            <ListItem sx={{ padding: "4px 16px", minHeight: "40px" }}>
              <FormControlLabel
                value="latest"
                control={<MonokromRadio />}
                label={<span className="filter-label">Latest</span>}
                sx={{ width: "100%", margin: 0 }}
              />
            </ListItem>
            <ListItem sx={{ padding: "4px 16px", minHeight: "40px" }}>
              <FormControlLabel
                value="oldest"
                control={<MonokromRadio />}
                label={<span className="filter-label">Oldest</span>}
                sx={{ width: "100%", margin: 0 }}
              />
            </ListItem>
          </RadioGroup>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

// --- New Only Block Component ---
const NewOnlyBlock: React.FC<{
  newOnly: boolean;
  onNewOnlyChange: (checked: boolean) => void;
  expanded: boolean;
  onToggleExpanded: () => void;
}> = ({ newOnly, onNewOnlyChange, expanded, onToggleExpanded }) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={onToggleExpanded}
      className="widget new-only-widget"
      sx={{
        boxShadow: "none",
        "&:before": { display: "none" },
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={20} />}
        aria-controls="panel-new-only-content"
        id="panel-new-only-header"
        className="widget-header"
      >
        <Typography
          variant="h3"
          component="h3"
          className="filter-title"
          sx={{ fontSize: "1rem", fontWeight: 600 }}
        >
          Display Order
        </Typography>
      </AccordionSummary>

      <AccordionDetails className="widget-details" sx={{ padding: 0 }}>
        <List className="filter-list" disablePadding>
          <ListItem sx={{ padding: "4px 16px", minHeight: "40px" }}>
            <FormControlLabel
              control={
                <MonokromCheckbox
                  checked={newOnly}
                  onChange={(e) => onNewOnlyChange(e.target.checked)}
                />
              }
              label={<span className="filter-label">New Only</span>}
              sx={{ width: "100%", margin: 0 }}
            />
          </ListItem>
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

// --- Main SidebarFilter Component with Drawer ---
const MobileSidebar: React.FC<SidebarFilterProps> = ({
  onFilterChange,
  collection_id,
  initialFilters,
}) => {
  const settings = useSiteSettings();
  const types = settings?.categories || [];

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [expandedSections, setExpandedSections] = useState<
    Record<FilterType | "sort" | "newOnly", boolean>
  >({
    categories: true,
    subCollections: true,
    sort: true,
    newOnly: true,
  });

  const allSubCollections = useMemo(() => {
    return settings?.sub_collections || [];
  }, [settings]);

  const [draftFilters, setDraftFilters] = useState<ExtendedActiveFilters>({
    categories: initialFilters?.categories || [],
    subCollections: initialFilters?.subCollections || [],
    sortBy: "latest",
    newOnly: false,
    sort_by: "",
  });

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const toggleExpand = useCallback(
    (section: FilterType | "sort" | "newOnly") => {
      setExpandedSections((prev) => ({
        ...prev,
        [section]: !prev[section],
      }));
    },
    []
  );

  const filteredSubCollections = useMemo(() => {
    let filtered = allSubCollections.filter(
      (sub) => sub?.collection_id == collection_id
    );

    if (draftFilters.categories.length > 0) {
      filtered = filtered.filter((sub) =>
        draftFilters.categories.includes(sub.category_id)
      );
    }

    return filtered;
  }, [allSubCollections, collection_id, draftFilters.categories]);

  const activeFilterCount = useMemo(() => {
    let count =
      draftFilters.categories.length + draftFilters.subCollections.length;
    if (draftFilters.sortBy !== "latest") count++;
    if (draftFilters.newOnly) count++;
    return count;
  }, [draftFilters]);

  const hasActiveFilters = activeFilterCount > 0;

  const handleCheckboxChange = useCallback(
    (filterType: FilterType, slug: string | number) => {
      const currentList = draftFilters[filterType];
      const isChecked = currentList.includes(slug);

      let newSelectedList: (string | number)[];
      if (isChecked) {
        newSelectedList = currentList.filter((itemSlug) => itemSlug !== slug);
      } else {
        newSelectedList = [...currentList, slug];
      }

      let newFilters: ExtendedActiveFilters = {
        ...draftFilters,
        [filterType]: newSelectedList,
      };

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

      setDraftFilters(newFilters);

      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [draftFilters, onFilterChange, allSubCollections]
  );

  const handleSortChange = useCallback(
    (sortBy: SortOption) => {
      const newFilters = { ...draftFilters, sortBy };
      setDraftFilters(newFilters);
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
    },
    [draftFilters, onFilterChange]
  );

  const handleNewOnlyChange = useCallback(
    (newOnly: boolean) => {
      const newFilters: ExtendedActiveFilters = {
        ...draftFilters,
        newOnly,
        sort_by: newOnly ? "new" : "",
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
      categories: [],
      subCollections: [],
      sort_by: "",
      sortBy: "latest",
      newOnly: false,
    };
    setDraftFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={toggleDrawer(true)}
        variant="outlined"
        startIcon={<SlidersHorizontal size={20} />}
        sx={{
          color: $black,
          borderColor: $black,
          "&:hover": {
            borderColor: $black,
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        Filters {hasActiveFilters && `(${activeFilterCount})`}
      </Button>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 400 },
            maxWidth: "100%",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            <IconButton onClick={toggleDrawer(false)} edge="end">
              <X size={24} />
            </IconButton>
          </Box>

          {/* Drawer Content */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {/* Reset Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
                pb: 2,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <Typography sx={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                {activeFilterCount} Active Filters
              </Typography>
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
            </Box>

            {/* New Only Block */}
            <NewOnlyBlock
              newOnly={draftFilters.newOnly}
              onNewOnlyChange={handleNewOnlyChange}
              expanded={expandedSections.newOnly}
              onToggleExpanded={() => toggleExpand("newOnly")}
            />

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
          </Box>

          {/* Drawer Footer (Optional Apply Button) */}
          {/* <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              onClick={toggleDrawer(false)}
              sx={{
                color: $black,
                borderColor: $black,
                "&:hover": {
                  borderColor: $black,
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={toggleDrawer(false)}
              sx={{
                backgroundColor: $black,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#333",
                },
              }}
            >
              Apply Filters
            </Button>
          </Box> */}
        </Box>
      </Drawer>
    </>
  );
};

export default MobileSidebar;
