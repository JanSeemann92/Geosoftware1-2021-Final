import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { HashRouter as Router } from "react-router-dom";
import { SightTile } from "./SightTile";

const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>{ui}</Router>
    </QueryClientProvider>
  );
};

const sight = {
  type: "Feature",
  properties: {
    id: "1234-4321-1234",
    name: "Sight Title",
    description: "Lorem ipsum dolor sit amet",
    url: "",
  },
  geometry: null,
};

describe("<SightTile />", () => {
  it("should be defined", () => {
    expect(SightTile).toBeDefined();
  });
  it("should show sight title and description", () => {
    renderWithProviders(<SightTile sight={sight} />);
    screen.getByText("Sight Title");
    screen.getByText("Lorem ipsum dolor sit amet");
  });
  it("should show full text", () => {
    const description =
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
    renderWithProviders(
      <SightTile
        sight={{ ...sight, properties: { ...sight.properties, description } }}
        showFullText
      />
    );
    screen.getByText(description);
  });
  it("should show the edit button", () => {
    renderWithProviders(<SightTile sight={sight} showEdit />);
    screen.getByLabelText("edit sight");
  });

  it("should show the MAGIC button", () => {
    renderWithProviders(<SightTile sight={sight} showMagicOption />);
    screen.getByLabelText("we will do magic things");
  });
});
