import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ButtonGroup,
  Button,
} from "@mui/material";
import { useState } from "react";
import Form from "../components/Form";
import DeleteModal from "../components/DeleteModal";
import PropTypes from "prop-types";
import { useOutletContext } from "react-router-dom";

const Store = () => {
  const { productos } = useOutletContext();
  const [viewForm, setViewForm] = useState(false);
  const [viewDelete, setViewDelete] = useState(false);
  const [option, setOption] = useState("");
  const [producto, setProducto] = useState(null);

  const handleAdd = () => {
    setOption("add");
    setViewForm(true);
  };

  const handleUpdate = (id)=>{        
    const product = productos.find((product) => product.idProd === id);
    setProducto(product);
    setOption("update");
    setViewForm(true);
  }

  const handleDelete = (id) =>{
    const productDelete = productos.find((product) => product.idProd === id);
    setProducto(productDelete);
    setViewDelete(true);
  }

  return (
    <>
      <Button variant="contained" color="success" onClick={handleAdd}>
        Agregar
      </Button>
      <TableContainer component={Paper} sx={{ mb: 4, mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ID Producto</TableCell>
              <TableCell align="center">Nombre</TableCell>
              <TableCell align="center">Detalle</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="center">Precio</TableCell>
              <TableCell align="center">Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow
                key={producto.idProd}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  {producto.idProd}
                </TableCell>
                <TableCell align="center">{producto.nameProd}</TableCell>
                <TableCell align="center">{producto.detail}</TableCell>
                <TableCell align="center">{producto.amount}</TableCell>
                <TableCell align="center">{producto.cost}</TableCell>
                <TableCell align="center">
                  <ButtonGroup size="small" aria-label="Basic button group">
                    <Button onClick={()=>{handleUpdate(producto.idProd)}} variant="contained">Editar</Button>
                    <Button onClick={()=>{handleDelete(producto.idProd)}} variant="contained" color="error">
                      Eliminar
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {viewForm && <Form open={viewForm} setViewForm={setViewForm} option={option} product={producto} setProducto={setProducto} />}
      {viewDelete && <DeleteModal open={viewDelete} setViewDelete={setViewDelete} product={producto} />}
    </>
  );
};

Store.propTypes = {
  productos: PropTypes.array,
};

export default Store;
