import { Switch, Route } from "react-router-dom";
import { SightList } from "./SightList";
import { SightForm } from "./SightForm";
import { SightDetails } from "./SightDetails";

export const SightRoutes = () => (
  <Switch>
    <Route path={["/sights/create", "/sights/:id/edit"]}>
      <SightForm />
    </Route>
    <Route path="/sights/:id">
      <SightDetails />
    </Route>
    <Route path="/sights">
      <SightList />
    </Route>
  </Switch>
);
