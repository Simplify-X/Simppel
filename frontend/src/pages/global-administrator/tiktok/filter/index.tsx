// @ts-nocheck
import React, { useState } from 'react'
import { Button, Grid, Card, CardContent, Typography, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { v4 as uuidv4 } from 'uuid'
import LivePreview from './LivePreview'

const AdminPanel = () => {
  const [filterElements, setFilterElements] = useState([]);
  const [newElement, setNewElement] = useState({ type: '', label: '', width: '', height: '' });

  const addElement = () => {
    if (!newElement.type) return;

    setFilterElements([...filterElements, { id: uuidv4(), ...newElement }]);
    setNewElement({ type: '', label: '', width: '', height: '' });
  };

  const onDragEnd = result => {
    if (!result.destination) return

    const items = Array.from(filterElements)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFilterElements(items)
  }

  const handleChange = (e) => {
    setNewElement({ ...newElement, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', padding: '10px' }}>
      <Card style={{ flex: 1, marginRight: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add Filter Elements
          </Typography>

          <Grid container spacing={2} style={{ flex: 1, marginRight: '20px' }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="element-type-label">Element Type</InputLabel>
                <Select
                  labelId="element-type-label"
                  id="element-type"
                  value={newElement.type}
                  label="Element Type"
                  name="type"
                  onChange={handleChange}
                >
                  <MenuItem value="search">Search Bar</MenuItem>
                  <MenuItem value="slider">Slider</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="label">Label</MenuItem>
                  {/* Add more options here */}
                </Select>
              </FormControl>
            </Grid>

            {(newElement.type === 'slider' || newElement.type === 'checkbox' || newElement.type === 'label') && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label={newElement.type === 'label' ? "Label Text" : "Label"}
                    name="label"
                    variant="outlined"
                    value={newElement.label}
                    onChange={handleChange}
                  />
                </Grid>
                {(newElement.type === 'slider' || newElement.type === 'checkbox') && (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Width"
                        name="width"
                        variant="outlined"
                        value={newElement.width}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Height"
                        name="height"
                        variant="outlined"
                        value={newElement.height}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            <Grid item xs={12}>
              <Button variant='contained' color='primary' fullWidth onClick={addElement}>
                Add Element
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <div style={{ flex: 1, padding: '10px' }}>
        <LivePreview filterElements={filterElements} onDragEnd={onDragEnd} setFilterElements={setFilterElements} />
      </div>
    </div>
  );
};

export default AdminPanel;
