import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PropTypes from "prop-types";

const SalesForm = ({ open, setViewForm, productos, totalSales }) => {
  const { control, handleSubmit, reset } = useForm();
  const [items, setItems] = useState([]);
  const [saleId, setSaleId] = useState(totalSales + 1);
  const [total, setTotal] = useState(0);
  const [customerName, setCustomerName] = useState("");

  const onSubmit = (data) => {
    const selectedProduct = productos.find(
      (product) => product.idProd === data.productId
    );

    if (selectedProduct) {
      const quantity = parseInt(data.quantity, 10);
      if (quantity > selectedProduct.amount) {
        alert(
          `La cantidad máxima para ${selectedProduct.nameProd} es ${selectedProduct.amount}`
        );
        return;
      }

      const newItem = {
        id: items.length + 1,
        productName: selectedProduct.nameProd,
        detail: selectedProduct.detail,
        quantity: quantity,
        price: selectedProduct.cost,
        total: selectedProduct.cost * quantity,
      };
      setItems((prevItems) => {
        const updatedItems = [...prevItems, newItem];
        // Calcula el nuevo total y actualiza el estado total
        setTotal(updatedItems.reduce((sum, item) => sum + item.total, 0));
        return updatedItems;
      });
    }

    reset({ productId: "", quantity: "" });
  };

  const handleClose = () => {
    setViewForm(false);
  };

  const handleSale = () => {
    fetch("http://localhost:8081/ventas",
      {
        method: "POST",
        headers:{
          "Content-Type": "text/plain",
        },
        body:`${saleId},${customerName},${total},${items.map((item) => `${item.productName},${item.quantity}`).join(",")}`
      }
    )
    .then((response) => {
      if (response.ok) {
        alert("Producto agregado con éxito");
        reset();
      } else {
        alert("Error al agregar el producto");
      }
    })
    .catch((error) => console.error("Error:", error));

    items.forEach((item) => {
      console.log(item);
      const selectedProduct = productos.find(
        (product) => product.idProd === item.id.toString()
      );
      
      fetch(`http://localhost:8080/productos/`,{
        method: "PUT",
        headers:{
          "Content-Type": "text/plain",
        },
        body: `${selectedProduct.idProd},${selectedProduct.nameProd},${selectedProduct.detail},${selectedProduct.amount - item.quantity},${selectedProduct.cost}`
      })
    });

    setViewForm(false);
  };
  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Formulario de compra
        </Typography>

        <TextField
          sx={{ mb: 2 }}
          label="ID de Boleta"
          value={saleId}
          disabled
          fullWidth
        />

        <TextField
          sx={{ mb: 2 }}
          label="Nombre del Cliente"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          fullWidth
        />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "flex", gap: 2, mb: 2 }}
        >
          <Controller
            name="productId"
            control={control}
            defaultValue=""
            rules={{ required: "Porfavor selecciona un producto" }}
            render={({ field }) => (
              <Select {...field} fullWidth displayEmpty>
                <MenuItem value="" disabled>
                  Selecciona un producto
                </MenuItem>
                {productos.map((product) => (
                  <MenuItem key={product.idProd} value={product.idProd}>
                    {product.nameProd}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="quantity"
            control={control}
            defaultValue=""
            rules={{
              required: "Cantidad requerida",
              min: { value: 1, message: "Cantidad minima 1" },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label="Cantidad"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </Box>

        {items.length > 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Descripcion</TableCell>
                  <TableCell>Cantidad</TableCell>
                  <TableCell>Precio</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.detail}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price}</TableCell>
                    <TableCell>${item.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Typography variant="h6" mt={2}>
          Total: ${total.toFixed(2)}
        </Typography>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={() => setItems([])}
          >
            Reiniciar
          </Button>
          <Button variant="contained" color="primary" onClick={handleSale}>
            Comprar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

SalesForm.propTypes = {
  open: PropTypes.bool.isRequired,
  setViewForm: PropTypes.func.isRequired,
  productos: PropTypes.array.isRequired,
  totalSales: PropTypes.number.isRequired,
};

export default SalesForm;
