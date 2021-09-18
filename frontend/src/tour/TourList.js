import { useCallback, useEffect, useState, useRef } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";

export const TourList = () => {
  const searchTimeout = useRef();
  const [search, setSearch] = useState("");
  const [searchParam, setSearchParam] = useState("");

  const { data: tourResponse } = useQuery(["tours", searchParam], () =>
    api.get(`/tours${searchParam ? `?search=${searchParam}` : ""}`)
  );

  const tours = tourResponse?.data || [];

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
          placeholder="Tour suchen..."
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
        {Array.isArray(tours) &&
          tours.map((tour, key) => (
            <Grid key={key} item>
              <Box component={Paper}>
                <ButtonBase
                  to={`/tours/${tour.id}`}
                  component={Link}
                  style={{ width: "100%", justifyContent: "flex-start" }}
                >
                  <Box p={1}>
                    <Typography variant="h6">
                      {tour.name || "Unbekannt"}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2">
                        {tour?.sights?.length || "0"} Sehenswürdigkeit
                        {tour?.sights?.length > 1 ? "en" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </ButtonBase>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
