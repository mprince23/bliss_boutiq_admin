import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import axiosInstance from "../../Instance";

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const handleFetchData = () => {
    axiosInstance
      .get("/api/product")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axiosInstance
      .delete("/api/product/" + id)
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
                    src={item.product_images[0]}
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
                  <IconButton
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={() => navigate(`/edit-product/${item._id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    variant="contained"
                    onClick={() => handleDelete(item._id)}
                    sx={{ color: "red" }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
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
