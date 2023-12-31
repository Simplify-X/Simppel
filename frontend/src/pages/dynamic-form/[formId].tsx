// @ts-nocheck

import React from 'react'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MUIDataTable from 'mui-datatables'
import { Fab, Dialog, DialogTitle, DialogContent, TextField, Button, MenuItem } from '@mui/material'
import useCustomApiHook from 'src/@core/hooks/useCustomApiHook'
import { useUserData } from 'src/@core/hooks/useUserData'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'
import FormLabel from '@mui/material/FormLabel'
import { v4 as uuidv4 } from 'uuid'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Loader from 'src/@core/components/ui/Loader'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility';

const DynamicFormPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const { formId } = router.query
  const [form, setForm] = useState(null)
  const [open, setOpen] = useState(false)
  const [select1Value, setSelect1Value] = useState('')
  const [select2Value, setSelect2Value] = useState('')
  const [, setProducts] = useState([])
  const [selectOptions, setSelectOptions] = useState([])
  const { get, post, put } = useCustomApiHook()
  const { userId } = useUserData()
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [textFieldValue, setTextFieldValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [imageValue, setImageValue] = useState('')
  const [, setAutoCompleteValue] = useState('')
  const [, setCheckVal] = useState('')
  const [editMode, setEditMode] = useState(false);
  const [tableData, setTableData] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [editingTableId, setEditingTableId] = useState(null);

  const [selectedAutoCompleteValues, setSelectedAutoCompleteValues] = useState({})
  



  const handleClick = rowData => {
    router.push(`/dynamic-form/details/${rowData}`)
  }
  


  // Function to handle radio option change

  useEffect(() => {
    if (formId) {
      const fetchForm = async () => {
        const res = await get(`/customFields/${formId}`)
        setForm(res?.data)
      }

      fetchForm()
    }
  }, [formId])

  useEffect(() => {
    const getSavedProduct = async () => {
      const product = await get(`/product/tracker/${userId}`)

      // Sorting the product array based on the created_at property
      product?.data.sort((a, b) => {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)

        return dateB - dateA
      })

      setProducts(product?.data)
      setSelectOptions(
        product?.data.map(product => ({
          value: product?.id,
          label: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={product?.image} alt='Product Image' style={{ width: '50px' }} />
              <span style={{ marginLeft: '10px' }}>
                {product?.title.length > MAX_TITLE_LENGTH
                  ? `${product?.title.slice(0, MAX_TITLE_LENGTH)}...`
                  : product?.title}
              </span>
            </div>
          )
        }))
      )
    }

    if (userId) {
      getSavedProduct()
    }
  }, [userId])

  const handleCheckboxChange = event => {
    setCheckboxValue(event.target.checked)
  }

  const handleTextFieldChange = event => {
    setTextFieldValue(event.target.value)
  }

  const handleTextAreaChange = event => {
    setTextAreaValue(event.target.value)
  }

  const handleAutoCompleteChange = (event, value, fieldName) => {
    setSelectedAutoCompleteValues(prevSelectedValues => ({
      ...prevSelectedValues,
      [fieldName]: value || '' // Store the selected value or an empty string if cleared
    }))
  }

  const [selectedValues, setSelectedValues] = useState({})

  const handleLocationChange = (event, fieldName) => {
    setSelectedValues(prevSelectedValues => ({
      ...prevSelectedValues,
      [fieldName]: event.target.value
    }))
    setCheckVal(event.target.value)
  }

  const handleImageUpload = event => {
    const files = event.target.files
    const newUploadedImages = Array.from(files)
    setUploadedImages(prevUploadedImages => [...prevUploadedImages, ...newUploadedImages])
  }

  const handleRemoveImage = index => {
    setUploadedImages(prevUploadedImages => {
      const updatedImages = [...prevUploadedImages]
      updatedImages.splice(index, 1)

      return updatedImages
    })
  }

  const MAX_TITLE_LENGTH = 20 // Maximum length of the product title

  const handleOpen = () => {
    setEditMode(false)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelect1Value('')
    setSelect2Value('')
    setCheckboxValue('')
    setTextFieldValue('')
    setTextAreaValue('')
    setImageValue('')
    setAutoCompleteValue('')
    setCheckVal('')
  }

  const getValueForField = (fieldType, fieldName) => {
    switch (fieldType) {
      case 'Tracker':
        return select1Value
      case 'Radio':
        return selectedValues[fieldName] || ''
      case 'Image':
        return imageValue
      case 'AutoComplete':
        return selectedAutoCompleteValues[fieldName] || ''
      case 'Textarea':
        return textAreaValue
      case 'Checkbox':
        return checkboxValue.toString()
      case 'TextField':
        return textFieldValue
      default:
        return ''
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const tableId = generateTableId()

    const fieldValues = form.map(f => ({
      fieldName: f.fieldName,
      fieldValue: getValueForField(f.fieldType, f.fieldName),
      fieldType: f.fieldType,
      tableId: tableId
    }))

    const payload = fieldValues

    const r = await post(`/dynamic-fields/${formId}`, payload)

    if (r.status == 201) {
      const res = await get(`/dynamic-fields/${formId}`)
      setTableData(res?.data)
    }

    handleClose()
  }

  async function handleEditForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  
    const fieldValues = form.map(f => ({
      fieldName: f.fieldName,
      fieldValue: getValueForField(f.fieldType, f.fieldName),
      fieldType: f.fieldType,
      tableId: editingTableId // Using the tableId of the row you're editing
    }))
  
    const payload = fieldValues;
  
    // Using a PATCH request for the edit
    const r = await put(`/dynamic-fields/${formId}`, payload)
  
    if (r.status == 200) { // Typically, a 200 OK is returned for successful updates
      const res = await get(`/dynamic-fields/${formId}`)
      setTableData(res?.data)
    }
  
    setEditingTableId(null); // Clear the editingTableId after edit
    handleClose();
  }
  

  useEffect(() => {
    if (formId) {
      const fetchTableData = async () => {
        const res = await get(`/dynamic-fields/${formId}`)
        setTableData(res?.data)
        setLoading(false)
      }

      fetchTableData()
    }
  }, [formId])

  const generateTableId = () => {
    // Generate a unique identifier (e.g., UUID) for the tableId
    // You can use a library like `uuid` to generate the UUID
    const tableId = uuidv4()

    return tableId
  }

  const transformTableData = () => {
    const transformedData = []
  
    tableData?.forEach(rowArray => {
      const rowData = { tableId: rowArray[0].tableId }  // Initializing with id
      rowArray.forEach(row => {
        rowData[row.fieldName] = row.fieldValue
      })
      transformedData.push(rowData)
    })
  
    return transformedData
  }
  

  const generateTableColumns = () => {
    if (!form) return []
  
    const columns = [
      {
        name: 'tableId',
        label: 'ID',
        options: {
          filter: true,
          sort: true,
          display: 'false'
        },
      },
      ...form.map(field => ({
        name: field.fieldName,
        label: field.fieldName,
        options: {
          filter: true,
          sort: true,
        },
      })), 
      {
        name: 'actions',
        label: 'Actions',
        options: {
          customBodyRender: (value, tableMeta) => {
  
            return (
              <>
                <IconButton
                  onClick={e => {
                    e.stopPropagation() // stop click event propagation
                    handleEdit(tableMeta.rowData)
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    handleClick(tableMeta.rowData[0])
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </>
            )
          }
        }
      }
    ]
  
    return columns
  }
  

  const tableColumns = generateTableColumns()
  const transformedTableData = transformTableData()

  const options = {
    filter: true,
    responsive: 'vertical',
    selectableRows: 'none',
  }

  const handleSelect1Change = e => {
    const value = e.target.value
    setSelect1Value(value)

    // Remove the selected option from select2Value
    if (value === select2Value) {
      setSelect2Value('')
    }
  }

  const handleSelect2Change = e => {
    const value = e.target.value
    setSelect2Value(value)

    // Remove the selected option from select1Value
    if (value === select1Value) {
      setSelect1Value('')
    }
  }

  const handleEdit = rowData => {
    setOpen(true);
    setEditMode(true);
    
    const [
      tableId,
      ...fields
    ] = rowData;
    
    setEditingTableId(tableId); // Set the current editingTableId

    form.forEach((field, index) => {
      const value = fields[index];
      
      switch (field.fieldType) {
        case 'Tracker':
          setSelect1Value(value);
          break;
        case 'Checkbox':
          setCheckboxValue(value === "true" || value === true);
          break;
        case 'TextField':
          setTextFieldValue(value);
          break;
        case 'Radio':
          setSelectedValues(prevValues => ({
            ...prevValues,
            [field.fieldName]: value
          }));
          break;
        case 'Image':
          setImageValue(value);
          break;
        case 'AutoComplete':
          setSelectedAutoCompleteValues(prevValues => ({
            ...prevValues,
            [field.fieldName]: value
          }));
          break;
        case 'Textarea':
          setTextAreaValue(value);
          break;
        default:
          break;
      }
    });
  
  };
  

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <h1>Custom Layout</h1>
      <MUIDataTable title='Dynamic Fields' data={transformedTableData} columns={tableColumns} options={options} />

      <Fab color='primary' aria-label='add' onClick={handleOpen} style={{ position: 'fixed', bottom: 24, right: 24 }}>
        +
      </Fab>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { width: '600px' } }}>
        <DialogTitle>Add New Entry</DialogTitle>
        <DialogContent>
          {form?.map(f => (
            <div key={f.fieldName}>
              {f.fieldType === 'Tracker' && (
                <>
                  <TextField
                    select
                    label='Select Option 1'
                    value={select1Value}
                    onChange={handleSelect1Change}
                    fullWidth
                    margin='normal'
                  >
                    {selectOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label='Select Option 2'
                    value={select2Value}
                    onChange={handleSelect2Change}
                    fullWidth
                    margin='normal'
                  >
                    {selectOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
              {f.fieldType === 'Radio' && (
                <FormControl style={{ marginTop: 20 }}>
                  <FormLabel id={`demo-radio-button-group-label-${f.fieldName}`}>{f.fieldName}</FormLabel>
                  <RadioGroup
                    aria-labelledby={`demo-radio-button-group-label-${f.fieldName}`}
                    name={`radio-button-group-${f.fieldName}`}
                    value={selectedValues[f.fieldName] || ''}
                    onChange={event => handleLocationChange(event, f.fieldName)}
                  >
                    {f.radioFieldValues.map(value => (
                      <FormControlLabel key={value} value={value} control={<Radio />} label={value} />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}

              {f.fieldType === 'Image' && (
                <>
                  <input
                    accept='image/*'
                    id='image-uploader'
                    type='file'
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                  <label htmlFor='image-uploader'>
                    <Button variant='contained' component='span' fullWidth>
                      Upload Image
                    </Button>
                  </label>
                  <Grid container spacing={1}>
                    {uploadedImages.map((file, index) => (
                      <Grid item key={index}>
                        <div style={{ position: 'relative' }}>
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            style={{ width: '80px', height: '80px' }}
                          />
                          <IconButton
                            style={{ position: 'absolute', top: 0, right: 0 }}
                            onClick={() => handleRemoveImage(index)}
                          >
                            <CloseIcon
                              style={{
                                color: '#000', // Set the desired color for the "X" icon
                                backgroundColor: 'rgba(255, 255, 255, 0.5)', // Set the desired background color for the icon
                                borderRadius: '50%',
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                padding: '2px'
                              }}
                            />
                          </IconButton>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
              {f.fieldType === 'AutoComplete' && (
                <Autocomplete
                  options={f?.autoCompleteValues}
                  onInputChange={(event, value) => handleAutoCompleteChange(event, value, f.fieldName)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label={f.fieldName}
                      value={selectedAutoCompleteValues[f.fieldName] || ''}
                      fullWidth
                      margin='normal'
                    />
                  )}
                />
              )}

              {f.fieldType === 'TextArea' && (
                <TextField
                  label={f.fieldName}
                  value={textAreaValue}
                  onChange={handleTextAreaChange}
                  fullWidth
                  multiline
                  rows={4}
                  margin='normal'
                />
              )}
              {f.fieldType === 'Checkbox' && (
                <FormControlLabel
                  control={
                    <Checkbox checked={checkboxValue} onChange={handleCheckboxChange} name='checkbox' color='primary' />
                  }
                  label={f.fieldName}
                />
              )}
              {f.fieldType === 'TextField' && (
                <TextField
                  label={f.fieldName}
                  value={textFieldValue}
                  onChange={handleTextFieldChange}
                  fullWidth
                  margin='normal'
                />
              )}
            </div>
          ))}
            <Button variant='contained' onClick={editMode ? handleEditForm : handleSubmit} sx={{ marginLeft: 1 }}>
              {editMode ? 'Edit' : 'Save'}
            </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DynamicFormPage
