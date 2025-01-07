import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  // Fetch data from API
  const handleFetchData = () => {
    axios
      .get("https://blissboutiq-backend.onrender.com/api/product")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    axios
      .delete("https://blissboutiq-backend.onrender.com/api/product/" + id, {
        headers: {
          token: `Bearer ${token}`,
        },
      })
      .then((res) => handleFetchData())
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    handleFetchData();
  }, []);

  return (
    <Box mt={5} p={2}>
      <Typography variant="h4" gutterBottom>
        Product List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Sub Category</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <img
                    src={item.product_images}
                    alt="Product"
                    width="60"
                    height="60"
                  />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.price.discounted_price}</TableCell>
                <TableCell>{item.stock}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.sub_category}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={() => navigate(`/edit-product/${item._id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Home;
