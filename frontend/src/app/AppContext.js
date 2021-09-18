import { createContext, useContext, useMemo, useState } from "react";

export const AppContext = createContext({
  showMap: false,
});
AppContext.displayName = "AppContext";

export const AppProvider = ({ children }) => {
  const [showMap, setShowMap] = useState(false);

  // memoize provider value to prevent unnecessary re-renderings
  const value = useMemo(
    () => ({
      setShowMap,
      showMap,
    }),
    [setShowMap, showMap]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};
