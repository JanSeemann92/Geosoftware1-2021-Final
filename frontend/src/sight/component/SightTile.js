import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import LinkMUI from "@material-ui/core/Link";
import EditIcon from "@material-ui/icons/Edit";
import { TruncateText } from "component";
import { api } from "common/api";
import { useMap } from "map";

export const SightTile = ({
  sight,
  showMagicOption = false,
  showEdit = false,
  showLink = false,
  showFullText = false,
  disableButton = false,
}) => {
  const queryClient = useQueryClient();
  const { map } = useMap();
  const { id: sightId } = sight.properties;

  const busStopLayer = useRef(null);

  const {
    data: sightInfoRequest,
    refetch: fetchSightsInfos,
    remove: removeSightInfos,
  } = useQuery(["sight_info"], () => api.get(`/sights/${sightId}/infos`), {
    enabled: false,
  });

  const sightInfos = sightInfoRequest?.data;

  const showMagicThings = () => {
    if (sightInfos && sightInfos.sightId === sightId) {
      removeSightInfos();
      queryClient.refetchQueries();
    } else {
      fetchSightsInfos();
    }
  };

  useEffect(() => {
    if (sightInfos && sightInfos.sightId === sightId) {
      busStopLayer.current = new window.L.FeatureGroup();
      map.addLayer(busStopLayer.current);
      const geoJsonLayer = window.L.geoJson(sightInfos.busStop);
      busStopLayer.current.addLayer(geoJsonLayer);
      map.fitBounds(busStopLayer.current.getBounds(), { maxZoom: 17 });
    }
    return () => {
      if (busStopLayer.current) {
        busStopLayer.current.clearLayers();
        map.removeLayer(busStopLayer.current);
      }
    };
  }, [map, sightInfos, sightId]);

  const content = (
    <Box p={1}>
      <Typography variant="h6">{sight.properties.name || "..."}</Typography>
      {showLink && sight.properties?.url ? (
        <Box mb={1} mt={1} width="100%">
          <LinkMUI
            href={sight.properties.url}
            target="_blank"
            color="inherit"
            variant="body2"
            underline="always"
          >
            Weitere Informationen
          </LinkMUI>
        </Box>
      ) : null}
      <Box mt={1}>
        <Typography variant="body2">
          {showFullText ? (
            sight.properties?.description || ""
          ) : (
            <TruncateText text={sight.properties?.description} />
          )}
        </Typography>
      </Box>
      {showMagicOption && sightInfos && sightInfos.sightId === sightId ? (
        <Box mt={2}>
          <Grid container>
            <Grid item xs={8}>
              <Typography variant="body2">Nächste Bushaltestelle:</Typography>
              <Box display="flex" height="40px" alignItems="center">
                <Typography variant="body2">
                  {sightInfos.busStop?.properties?.lbez || "-"}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2">Wetter:</Typography>
              {sightInfos?.weather?.weather[0] ? (
                <Grid container direction="row" alignItems="center" spacing={1}>
                  <Grid item>
                    <img
                      alt="current weather"
                      height="40px"
                      src={`https://openweathermap.org/img/wn/${sightInfos.weather.weather[0].icon}@2x.png`}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      {sightInfos.weather.main.temp
                        .toFixed(1)
                        .replace(".", ",")}{" "}
                      C°
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                "-"
              )}
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </Box>
  );

  return (
    <Box component={disableButton ? null : Paper} width="100%">
      {disableButton ? (
        content
      ) : (
        <ButtonBase
          to={`/sights/${sight.properties.id}`}
          component={Link}
          style={{ width: "100%", justifyContent: "flex-start" }}
        >
          {content}
        </ButtonBase>
      )}
      {showMagicOption || showEdit ? (
        <Grid container spacing={1} justifyContent="flex-end">
          {showEdit ? (
            <Grid item>
              <Box mb={1}>
                <Button
                  aria-label="edit sight"
                  variant="outlined"
                  component={Link}
                  to={`/sights/${sight.properties.id}/edit`}
                >
                  <EditIcon />
                </Button>
              </Box>
            </Grid>
          ) : null}
          {showMagicOption ? (
            <Grid item>
              <Box mx={1} mb={1}>
                <Button
                  aria-label="we will do magic things"
                  variant="outlined"
                  onClick={showMagicThings}
                >
                  <MagicStickIcon />
                </Button>
              </Box>
            </Grid>
          ) : null}
        </Grid>
      ) : null}
    </Box>
  );
};

// Source: https://fonts.google.com/icons?selected=Material%20Icons%20Outlined%3Aauto_fix_high%3A
const MagicStickIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    height={24}
    width={24}
    fill="#FFF"
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="M20 7l.94-2.06L23 4l-2.06-.94L20 1l-.94 2.06L17 4l2.06.94zM8.5 7l.94-2.06L11.5 4l-2.06-.94L8.5 1l-.94 2.06L5.5 4l2.06.94zM20 12.5l-.94 2.06-2.06.94 2.06.94.94 2.06.94-2.06L23 15.5l-2.06-.94zM17.71 9.12l-2.83-2.83c-.2-.19-.45-.29-.71-.29-.26 0-.51.1-.71.29L2.29 17.46a.996.996 0 000 1.41l2.83 2.83c.2.2.45.3.71.3s.51-.1.71-.29l11.17-11.17c.39-.39.39-1.03 0-1.42zm-3.54-.7l1.41 1.41L14.41 11 13 9.59l1.17-1.17zM5.83 19.59l-1.41-1.41L11.59 11 13 12.41l-7.17 7.18z" />
  </svg>
);
