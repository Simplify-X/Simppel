// @ts-nocheck
import React from 'react';
import {
  Box, Card, CardContent, TextField, Checkbox, FormGroup, FormControlLabel,
  Slider, Typography, InputAdornment, IconButton
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import RemoveIcon from '@mui/icons-material/Remove';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const useStyles = makeStyles({
  filterPanel: {
    borderRadius: '8px',
    padding: '16px',
    position: 'sticky',
    top: '20px',
    maxHeight: 'calc(100vh - 20px)',
    overflowY: 'auto',
    width: '50%',
  },
  filterSection: {
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
  },
  popularProduct: {
    padding: '10px 0',
    borderBottom: '1px solid #eee'
  },
  title: {
    fontWeight: 700,
    paddingBottom: '16px'
  }
});

const LivePreview = ({ filterElements, onDragEnd, setFilterElements }) => {
  const classes = useStyles();

  const handleRemoveElement = (id) => {
    setFilterElements(prevElements => prevElements.filter(element => element.id !== id));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {provided => (
          <Box {...provided.droppableProps} ref={provided.innerRef} display='flex' justifyContent='left'>
            <Card className={classes.filterPanel}>
              <CardContent>
                <Typography variant='h6' className={classes.title}>FILTER</Typography>
                {filterElements.map((element, index) => (
                  <Draggable key={element.id} draggableId={element.id} index={index}>
                    {provided => (
                      <Box 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        className={classes.filterSection}
                      >
                        <IconButton {...provided.dragHandleProps}>
                          <DragHandleIcon />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveElement(element.id)}>
                          <RemoveIcon />
                        </IconButton>
                        {element.type === 'search' && (
                          <TextField
                            fullWidth
                            variant='outlined'
                            placeholder='Search...'
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  <SearchIcon />
                                </InputAdornment>
                              )
                            }}
                          />
                        )}
                        {element.type === 'slider' && <Slider defaultValue={30} />}
                        {element.type === 'checkbox' && (
                          <FormGroup>
                            <FormControlLabel 
                              control={<Checkbox />} 
                              label={element.label || 'Checkbox'} 
                            />
                          </FormGroup>
                        )}
                        {element.type === 'label' && (
                          <Typography variant='subtitle1'>
                            {element.label}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </CardContent>
            </Card>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default LivePreview;
