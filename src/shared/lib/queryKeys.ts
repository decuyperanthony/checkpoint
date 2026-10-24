// Cache keys shared across features: removing a section also removes its items server-side,
// so the sections feature invalidates the items cache without importing the items feature.
export const queryKeys = {
  sections: ["sections"],
  items: ["items"],
} as const;
