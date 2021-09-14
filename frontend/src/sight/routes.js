import { Switch, Route } from "react-router-dom";
import { SightList } from "./SightList";
import { SightForm } from "./SightForm";

export const SightRoutes = () => (
  <Switch>
    <Route path={["/sights/create", "/sights/:id/edit"]}>
      <SightForm />
    </Route>
    <Route path="/sights">
      <SightList />
    </Route>
  </Switch>
);
