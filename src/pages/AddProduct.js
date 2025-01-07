import React, { useState, useEffect } from "react";
import upload_area from "../assets/images/addProduct/upload_area1.svg";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextareaAutosize,
  Typography,
  Grid,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    size_options: [],
    category: "",
    sub_category: "",
    gender: "",
    price: { orignal_price: "", discounted_price: "" },
    color_options: [],
    instruction: "",
    product_images: null,
    stock: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get(`https://blissboutiq-backend.onrender.com/api/product/${id}`)
        .then((response) => {
          const product = response.data;
          setFormData({
            ...product,
            price: {
              orignal_price: product.price?.orignal_price || "",
              discounted_price: product.price?.discounted_price || "",
            },
            product_images: product.product_images || null,
          });
        })
        .catch((error) => {
          toast.error("Failed to fetch product details");
          console.error("Error fetching product:", error);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, product_images: file }));
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [name]: value,
      },
    }));
  };

  const handleAddSize = () => {
    setFormData((prev) => ({
      ...prev,
      size_options: [...prev.size_options, { size: "", stock: "" }],
    }));
  };

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      color_options: [...prev.color_options, { color: "", hex: "" }],
    }));
  };

  const handleSizeChange = (e, index) => {
    const newSizeOptions = [...formData.size_options];
    newSizeOptions[index] = {
      ...newSizeOptions[index],
      [e.target.name]: e.target.value,
    };
    setFormData((prev) => ({ ...prev, size_options: newSizeOptions }));
  };
  const handleColorChange = (e, index) => {
    const newColorOptions = [...formData.color_options];
    newColorOptions[index] = {
      ...newColorOptions[index],
      [e.target.name]: e.target.value,
    };
    setFormData((prev) => ({ ...prev, color_options: newColorOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formDataPayload = new FormData();

    Object.keys(formData).forEach((key) => {
      if (
        key === "price" ||
        key === "size_options" ||
        key === "color_options" ||
        key === "instruction"
      ) {
        formDataPayload.append(key, JSON.stringify(formData[key]));
      } else if (key === "product_images" && formData.product_images) {
        formDataPayload.append(key, formData.product_images);
      } else {
        formDataPayload.append(key, formData[key]);
      }
    });

    try {
      const url = id
        ? `https://blissboutiq-backend.onrender.com/api/product/${id}`
        : "https://blissboutiq-backend.onrender.com/api/product";

      const method = id ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formDataPayload,
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(`Product ${id ? "updated" : "added"} successfully!`);
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error(`Failed to ${id ? "update" : "add"} product!`);
    }
  };

  if (isLoading) {
    return <Typography>Loading product details...</Typography>;
  }

  return (
    <Box
      component="section"
      sx={{
        mt: "50px",
        p: 4,
        backgroundColor: "rgba(240, 248, 255, 0.2)",
        width: "100%",
      }}
    >
      <form onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", pb: 2, textTransform: "uppercase" }}
        >
          {id ? "Edit Product" : "Add Product"}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box>
              <Typography variant="body1">Upload Product Image</Typography>
              <label htmlFor="product_images">
                <img
                  src={
                    formData.product_images
                      ? formData.product_images instanceof File
                        ? URL.createObjectURL(formData.product_images)
                        : formData.product_images
                      : upload_area
                  }
                  alt="Upload Preview"
                  style={{ height: 100, cursor: "pointer", objectFit: "cover" }}
                />
              </label>
              <input
                type="file"
                id="product_images"
                name="product_images"
                onChange={handleFileChange}
                hidden
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Title"
              variant="outlined"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter product title"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Stock"
              variant="outlined"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="Enter Stock"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              minRows={4}
              style={{
                width: "100%",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                padding: "8px",
                borderRadius: "4px",
                outline: "none",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
              >
                <MenuItem value="men">Men</MenuItem>
                <MenuItem value="women">Women</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sub-Category"
              variant="outlined"
              name="sub_category"
              value={formData.sub_category}
              onChange={handleInputChange}
              placeholder="Enter sub-category"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Price Options
            </Typography>
            <Grid container spacing={2} mt={"8px"}>
              <Grid item xs={6}>
                <TextField
                  label="Original Price"
                  variant="outlined"
                  name="orignal_price"
                  value={formData.price.orignal_price}
                  onChange={handlePriceChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Discounted Price"
                  variant="outlined"
                  name="discounted_price"
                  value={formData.price.discounted_price}
                  onChange={handlePriceChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Size Options
            </Typography>
            {formData.size_options.map((size, index) => (
              <Grid container spacing={2} key={index} mt={"8px"}>
                <Grid item xs={6}>
                  <TextField
                    label="Size"
                    variant="outlined"
                    name="size"
                    value={size.size}
                    onChange={(e) => handleSizeChange(e, index)}
                    onInput={(e) =>
                      (e.target.value = e.target.value.toUpperCase())
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Stock"
                    variant="outlined"
                    name="stock"
                    value={size.stock}
                    onChange={(e) => handleSizeChange(e, index)}
                    type="number"
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddSize}>Add Size</Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Color Options
            </Typography>
            {formData.color_options.map((color, index) => (
              <Grid container spacing={2} key={index} mt={"8px"}>
                <Grid item xs={6}>
                  <TextField
                    label="Color"
                    variant="outlined"
                    name="color"
                    value={color.color}
                    onChange={(e) => handleColorChange(e, index)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Hex Color"
                    variant="outlined"
                    name="hex"
                    value={color.hex}
                    onChange={(e) => handleColorChange(e, index)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
            <Button onClick={handleAddColor}>Add Color</Button>
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize
              name="instruction"
              value={formData.instruction}
              onChange={handleInputChange}
              placeholder="Enter product instructions"
              minRows={4}
              style={{
                width: "100%",
                border: "1px solid rgba(0, 0, 0, 0.23)",
                padding: "8px",
                borderRadius: "4px",
                outline: "none",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "black" }}
              fullWidth
            >
              Upload Product
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddProduct;
