import { QueryClient, QueryClientProvider } from "react-query";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MapProvider } from "map";
import { AppProvider } from "app";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    type: "dark",
  },
});

export const Providers = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <MapProvider>
          <AppProvider>{children}</AppProvider>
        </MapProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
