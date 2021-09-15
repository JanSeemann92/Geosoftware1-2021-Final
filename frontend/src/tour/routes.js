import { Switch, Route } from "react-router-dom";
import { TourList } from "./TourList";
import { TourForm } from "./TourForm";

export const TourRoutes = () => (
  <Switch>
    <Route path={["/tours/create", "/tours/:id/edit"]}>
      <TourForm />
    </Route>
    <Route path="/">
      <TourList />
    </Route>
  </Switch>
);
