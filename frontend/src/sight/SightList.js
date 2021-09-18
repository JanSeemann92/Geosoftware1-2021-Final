import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "react-query";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { api } from "common/api";
import { useSightsOnMap } from "map/hooks";
import { SightTile } from "./component";

export const SightList = () => {
  const { highlightSightOnMap, resetHighlightSightOnMap, setSights } =
    useSightsOnMap();

  const searchTimeout = useRef();
  const [search, setSearch] = useState("");
  const [searchParam, setSearchParam] = useState("");

  const { data: sightsResponse } = useQuery(["sights", searchParam], () =>
    api.get(`/sights${searchParam ? `?search=${searchParam}` : ""}`)
  );

  const sights = useMemo(
    () => sightsResponse?.data || [],
    [sightsResponse?.data]
  );

  useEffect(() => {
    setSights(sights);
  }, [setSights, sights]);

  useEffect(() => {
    searchTimeout.current = setTimeout(() => {
      setSearchParam(search);
    }, 700);
    return () => {
      clearTimeout(searchTimeout.current);
    };
  }, [search, setSearchParam]);

  const updateSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const clearSearch = useCallback(
    (e) => {
      setSearch("");
      setSearchParam("");
    },
    [setSearch, setSearchParam]
  );

  return (
    <Box m={2} pt={1} pb={12}>
      <Box mb={2}>
        <TextField
          variant="outlined"
          fullWidth
          type="text"
          placeholder="Sehenswürdigkeit suchen..."
          value={search}
          onChange={updateSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={clearSearch}>
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Grid container direction="column" spacing={2}>
        {Array.isArray(sights) &&
          sights.map((sight, key) => (
            <Grid
              key={key}
              item
              onMouseEnter={() => highlightSightOnMap(sight.properties.id)}
              onMouseLeave={() => resetHighlightSightOnMap(sight.properties.id)}
            >
              <SightTile sight={sight} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
