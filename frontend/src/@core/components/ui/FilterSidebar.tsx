// @ts-nocheck

import React from 'react';
import { Box, Card, CardContent, TextField, ToggleButton, ToggleButtonGroup, Checkbox, FormGroup, FormControlLabel, Slider, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  filterPanel: {
    borderRadius: '8px',
    padding: '16px',
    position: 'sticky',
    top: '20px',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto',
  },
  filterSection: {
    marginBottom: '24px',
  },
  popularProduct: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  title: {
    fontWeight: 700,
    paddingBottom: '16px',
  }
});

const FilterSidebar = ({ setSearchTerm }) => {
  const classes = useStyles();

  const [sortOptions, setSortOptions] = React.useState<string[]>([]);

  const handleSort = (event: React.MouseEvent<HTMLElement>, newSortOptions: string[]) => {
    setSortOptions(newSortOptions);
  };

  return (
    <Box display="flex" justifyContent="left">
      <Card className={classes.filterPanel}>
        <CardContent>
          {/* Title */}
          <Typography variant="h6" className={classes.title}>FILTER</Typography>

          {/* Filter Search */}
          <Box className={classes.filterSection}>
            <TextField
              fullWidth
              placeholder="Search headphone"
              variant="outlined"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Category Selection */}
          <Box className={classes.filterSection}>
            <Typography variant="subtitle1">CATEGORY</Typography>
            <FormGroup>
              <FormControlLabel control={<Checkbox />} label="Headphone" />
              <FormControlLabel control={<Checkbox />} label="Headband" />
              <FormControlLabel control={<Checkbox />} label="Earbuds" />
            </FormGroup>
          </Box>

          {/* Sort Options */}
          <Box className={classes.filterSection}>
            <Typography variant="subtitle1">SORT BY</Typography>
            <ToggleButtonGroup
              value={sortOptions}
              onChange={handleSort}
              aria-label="sort options"
              multiple
            >
              <ToggleButton value="popularity" aria-label="popularity">
                Popularity
              </ToggleButton>
              <ToggleButton value="newest" aria-label="newest">
                Newest
              </ToggleButton>
              <ToggleButton value="oldest" aria-label="oldest">
                Oldest
              </ToggleButton>
              {/* ... other sort options */}
            </ToggleButtonGroup>
          </Box>

          {/* Price Range */}
          <Box className={classes.filterSection}>
            <Typography variant="subtitle1">PRICE RANGE</Typography>
            <Slider
              value={[20, 50]} // replace with state values
              // onChange={() => {}} // replace with your handler
              valueLabelDisplay="auto"
              max={100}
            />
          </Box>

          {/* <Box className={classes.filterSection}>
            <Typography variant="subtitle1">POPULAR PRODUCT</Typography>
            <Box className={classes.popularProduct}>
              <Typography variant="body1">TMA-2 Comfort Wireless</Typography>
              <Typography variant="body2">USD 270</Typography>
              <Typography variant="body2">48 Reviews</Typography>
            </Box>
          </Box> */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FilterSidebar;
