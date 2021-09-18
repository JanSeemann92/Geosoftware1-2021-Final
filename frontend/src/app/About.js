import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

export const About = () => {
  return (
    <Box m={2} pb={12}>
      <Box mb={2}>
        <Typography variant="h6">Impressum / Über uns</Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="body2">
          Von: Noel Schnierer, Jan Seemann
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="body2">
          Uni Projekt: Geosoftware 1, SS 2021
        </Typography>
      </Box>
    </Box>
  );
};
