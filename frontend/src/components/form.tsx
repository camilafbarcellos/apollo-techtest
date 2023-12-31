import React, { useState } from 'react';
import {
  Alert, Button, Grid, InputAdornment,
  MenuItem, Stack, TextField,
} from '@mui/material';
import axios from 'axios';
import { ProductCategory } from '../types/productCategory';
import { Product } from '../types/product';

function RegisterForm() {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const initialProductState: Product = {
    name: '',
    description: '',
    color: '',
    category: '',
    price: parseInt('')
  };

  const [product, setProduct] = useState(initialProductState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const isFormValid = () => {
    for (const key in product) {
      if (!product[key as keyof typeof product] || product.price < 0) {
        return false;
      }
    }
    return true;
  };

  const handleRegister = async () => {
    if (!isFormValid()) {
      setSuccess(false);
      setFailure(true);
      return;
    }

    try {
      await axios.post('http://localhost:3100/products', product);
      setSuccess(true);
      setFailure(false);
      setProduct(initialProductState);
    } catch (error) {
      setSuccess(false);
      setFailure(true);
      console.error('Error:', error);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center">
      <form style={{ minWidth: '35%' }}>
        <Stack spacing={2}>
          <TextField
            required
            type="text"
            label="Name"
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <TextField
            required
            type="text"
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
          />
          <TextField
            required
            type="text"
            label="Color"
            name="color"
            value={product.color}
            onChange={handleChange}
          />
          <TextField
            select
            label="Category"
            helperText="Please select a category"
            name="category"
            value={product.category}
            onChange={handleChange}
          >
            {Object.values(ProductCategory).map((category, index) => (
              <MenuItem key={index} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            type="number"
            label="Price"
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            name="price"
            value={product.price}
            onChange={handleChange}
          />
          <Button variant="contained" color="primary" onClick={handleRegister}>
            Register product
          </Button>
          {success && <Alert severity="success">Success!</Alert>}
          {failure && <Alert severity="error">Invalid product, try again!</Alert>}
        </Stack>
      </form>
    </Grid>
  );
}

export default RegisterForm;