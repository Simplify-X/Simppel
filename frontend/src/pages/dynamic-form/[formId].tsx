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

const DynamicFormPage = () => {
  const router = useRouter()
  const { formId } = router.query
  const [form, setForm] = useState(null)
  const [open, setOpen] = useState(false)
  const [select1Value, setSelect1Value] = useState('')
  const [select2Value, setSelect2Value] = useState('')
  const [, setProducts] = useState([])
  const [selectOptions, setSelectOptions] = useState([])
  const { get, post } = useCustomApiHook()
  const { userId } = useUserData()
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [textFieldValue, setTextFieldValue] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [imageValue, setImageValue] = useState('')
  const [autoCompleteValue, setAutoCompleteValue] = useState('')
  const [checkValue, setCheckVal] = useState('')
  const [tableData, setTableData] = useState(null)

  // Function to handle radio option change

  const autoCompleteOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' }
  ]

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

  const handleImageChange = event => {
    setImageValue(event.target.value)
  }

  const handleAutoCompleteChange = (event: React.ChangeEvent<{}>, value: any) => {
    if (value) {
      setAutoCompleteValue(value)
    } else {
      setAutoCompleteValue('')
    }
  }

  const handleLocationChange = event => {
    setCheckVal(event.target.value)
  }

  const MAX_TITLE_LENGTH = 20 // Maximum length of the product title

  const handleOpen = () => {
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

  const getValueForField = fieldType => {
    switch (fieldType) {
      case 'Tracker':
        return select1Value
      case 'Radio':
        return checkValue
      case 'Image':
        return imageValue
      case 'AutoComplete':
        return autoCompleteValue
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
      fieldValue: getValueForField(f.fieldType),
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

  useEffect(() => {
    if (formId) {
      const fetchTableData = async () => {
        const res = await get(`/dynamic-fields/${formId}`)
        setTableData(res?.data)
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
      const rowData = {}
      rowArray.forEach(row => {
        rowData[row.fieldName] = row.fieldValue
      })
      transformedData.push(rowData)
    })

    return transformedData
  }

  const generateTableColumns = () => {
    if (!form) return []

    const columns = form.map(field => ({
      name: field.fieldName,
      label: field.fieldName,
      options: {
        filter: true,
        sort: true
      }
    }))

    return columns
  }

  const tableColumns = generateTableColumns()
  const transformedTableData = transformTableData()

  const options = {
    filter: true,
    responsive: 'vertical',
    selectableRows: 'none'
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
                <FormControl>
                  <FormLabel id='demo-radio-button-group-label'></FormLabel>
                  <RadioGroup
                    aria-labelledby='demo-radio-button-group-label'
                    name='radio-button-group'
                    value={checkValue}
                    onChange={handleLocationChange}
                  >
                    <FormControlLabel value='facebook' control={<Radio />} label={f.fieldName} />
                  </RadioGroup>
                </FormControl>
              )}
              {f.fieldType === 'Image' && (
                <TextField
                  label={f.fieldName}
                  value={imageValue}
                  onChange={handleImageChange}
                  fullWidth
                  margin='normal'
                />
              )}
              {f.fieldType === 'AutoComplete' && (
                <Autocomplete
                  options={autoCompleteOptions}
                  getOptionLabel={option => option.label}
                  onInputChange={handleAutoCompleteChange}
                  renderInput={params => (
                    <TextField {...params} label={f.fieldName} value={autoCompleteValue} fullWidth margin='normal' />
                  )}
                />
              )}
              {f.fieldType === 'Textarea' && (
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
          <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: '1rem' }}>
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DynamicFormPage
