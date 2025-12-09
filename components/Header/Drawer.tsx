// components/CustomMUIDrawer.jsx
"use client";

import React from "react";
import Drawer from "@mui/material/Drawer";
import { SearchDrawerContent } from "./DrawerList"; // Import komponen konten pencarian Anda

const CustomMUIDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="top" // Umumnya digunakan 'top' atau 'right' untuk overlay pencarian
      // Properti untuk styling custom pada elemen kertas (latar belakang Drawer)
      slotProps={{
        paper: {
          // Menargetkan elemen Paper (latar belakang Drawer)
          sx: {
            // Atur agar Drawer mengambil seluruh tinggi viewport dan lebar viewport
            height: "80%",
            width: "100%",
            maxWidth: "none",
            maxHeight: "none",
            // Hilangkan bayangan default
            boxShadow: "none",
          },
        },
      }}
    >
      {/* Gunakan div sebagai container pengganti Box. 
        Terapkan gaya untuk mengatur dimensi dan scrolling.
      */}
      <div
        role="presentation"
        style={{
          width: "100%",
          height: "100%",
          overflowY: "auto", // Mengizinkan scroll jika konten terlalu panjang
          // Tambahkan styling latar belakang atau font jika diperlukan
          backgroundColor: "white",
        }}
      >
        {/* Konten Pencarian Anda. Pastikan menerima onClose */}
        <SearchDrawerContent />
      </div>
    </Drawer>
  );
};

export default CustomMUIDrawer;
