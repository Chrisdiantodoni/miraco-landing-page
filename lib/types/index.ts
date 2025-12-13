// types/index.ts
export * from "./base";
export * from "./hero";
export * from "./product/collection";
export * from "./project";
// export * from "./home";

// Atau grouped export
import { Meta, ApiResponse } from "./base";
import { HeroSection, HeroTranslation } from "./hero";
import { Collection } from "./product/collection";
import { Project } from "./project";
// import { HomeData, HomeResponse } from "./home";

export type {
  Meta,
  ApiResponse,
  HeroSection,
  HeroTranslation,
  Collection,
  Project,
};
