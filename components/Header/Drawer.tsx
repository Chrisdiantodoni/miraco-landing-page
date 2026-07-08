/* eslint-disable @typescript-eslint/no-explicit-any */
// components/CustomMUIDrawer.jsx
"use client";

import React from "react";
import Drawer from "@mui/material/Drawer";
import { SearchDrawerContent } from "./DrawerList"; // Import komponen konten pencarian Anda
import { useState } from "react";
import { useMemo } from "react";
import createStore from "../../context/index";

const CustomMUIDrawer = () => {
  const { isOpenDrawer, handle } = createStore((state) => state);
  const [heightState, setHeightState] = useState("compact");

  const drawerHeight = useMemo(() => {
    if (heightState === "full") {
      return "80vh";
    }
    // Kita gunakan 'auto' untuk Loading/Not Found (agar hanya setinggi konten)
    if (heightState === "auto") {
      return "auto";
    }
    // Default / compact: Hanya untuk Search Bar (15vh)
    return "15vh";
  }, [heightState]);
  return (
    <Drawer
      open={isOpenDrawer}
      onClose={() => handle!("isOpenDrawer", false)}
      anchor="top"
      transitionDuration={300} // Transisi untuk pembukaan/penutupan drawer
      slotProps={{
        paper: {
          sx: {
            // Kontrol tinggi utama ada di sini
            height: drawerHeight,
            width: "100%",
            maxWidth: "none",
            maxHeight: "none",
            boxShadow: "none",
            // ✅ Pastikan tidak ada padding di Paper yang menyebabkan gap
            padding: 0,
            // ✅ Transisi CSS untuk tinggi yang mulus
            transition: "height 0.3s ease-in-out",
          },
        },
      }}
    >
      {/* Container Internal (role="presentation") */}

      <SearchDrawerContent onSearch={(value) => setHeightState(value)} />
    </Drawer>
  );
};

export default CustomMUIDrawer;
