import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import PropTypes from "prop-types";

const Form = ({ open, setViewForm, option, product, setProducto }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    if (option === "add") {
      fetch("http://localhost:8080/productos", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain", // El servidor espera texto plano
        },
        body: `${data.idProd},${data.nameProd},${data.detail},${data.amount},${data.cost}`,
      })
        .then((response) => {
          if (response.ok) {
            alert("Producto agregado con éxito");
            reset();
          } else {
            alert("Error al agregar el producto");
          }
        })
        .catch((error) => console.error("Error:", error));
    } else if (option === "update") {
        console.log(data);
        
      fetch(`http://localhost:8080/productos/${product.idProd}`, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain", // El servidor espera texto plano
        },
        body: `${data.idProd},${data.nameProd},${data.detail},${data.amount},${data.cost}`,
      })
        .then((response) => {
          if (response.ok) {
            alert("Producto actualizado con éxito");
            reset();
          } else {
            alert("Error al actualizar el producto");
          }
        })
        .catch((error) => console.error("Error:", error));
    }
    setViewForm(false);
  };

  const handleClose = () => {
    setProducto(null);
    setViewForm(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Formulario de Producto</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("idProd")}
            label="ID Producto"
            fullWidth
            margin="normal"
            defaultValue={product ? product.idProd : ''}
          />
          <TextField
            {...register("nameProd")}
            label="Nombre Producto"
            fullWidth
            margin="normal"
            defaultValue={product ? product.nameProd : ''}
          />
          <TextField
            {...register("detail")}
            label="Detalles"
            fullWidth
            margin="normal"
            defaultValue={product ? product.detail : ''}
          />
          <TextField
            {...register("amount")}
            label="Cantidad"
            type="number"
            fullWidth
            margin="normal"
            defaultValue={product ? product.amount : ''}
          />
          <TextField
            {...register("cost")}
            label="Costo"
            type="number"
            fullWidth
            margin="normal"
            defaultValue={product ? product.cost : ''}
          />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Enviar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

Form.propTypes = {
    open: PropTypes.bool.isRequired,
    setViewForm: PropTypes.func.isRequired,
    option: PropTypes.string.isRequired,
    product: PropTypes.object,
    setProducto: PropTypes.func.isRequired,
};

export default Form;
