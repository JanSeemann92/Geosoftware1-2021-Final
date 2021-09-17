import { Switch, Route } from "react-router-dom";
import { TourList } from "./TourList";
import { TourForm } from "./TourForm";
import { TourDetails } from "./TourDetails";

export const TourRoutes = () => (
  <Switch>
    <Route path={["/tours/create", "/tours/:id/edit"]}>
      <TourForm />
    </Route>
    <Route path="/tours/:id">
      <TourDetails />
    </Route>
    <Route path="/">
      <TourList />
    </Route>
  </Switch>
);
