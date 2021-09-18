import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { api } from "common/api";
import { useEffect, useMemo } from "react";
import { SightTile } from "sight/component";
import { useSightsOnMap } from "map";

export const SightDetails = () => {
  const { id: sightId } = useParams();

  const { setSights } = useSightsOnMap();

  const { data: sightResponse } = useQuery(["sights", sightId], () =>
    api.get(`/sights/${sightId}`)
  );
  const sight = useMemo(() => sightResponse?.data, [sightResponse]);

  useEffect(() => {
    if (sight?.geometry) {
      setSights([sight]);
    }
  }, [setSights, sight]);

  if (!sight) {
    return null;
  }

  return (
    <Box m={2}>
      <SightTile
        sight={sight}
        showEdit
        showMagicOption
        showFullText
        showLink
        disableButton
      />
    </Box>
  );
};
