import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fragment, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import SalesForm from "../components/SalesForm";
import SaleDeleteModal from "../components/SaleDeleteModal";

function createData(id, customer, total, products) {
  return { id, customer, total, products };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [viewDelete, setViewDelete] = useState(false);

  const handleUpdate = (id) => {
    console.log(`Editar venta ${id}`);
  };
  const handleDelete = () => {
    setViewDelete(true);
  };

  return (
    <>
    <Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="center">{row.customer}</TableCell>
        <TableCell align="center">{row.total}</TableCell>
        <TableCell align="center">
          <ButtonGroup size="small" aria-label="Basic button group">
            <Button
              onClick={() => {
                handleUpdate(row.id);
              }}
              variant="contained"
            >
              Editar
            </Button>
            <Button
              onClick={() => {
                handleDelete();
              }}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detalle de la venta
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
    {viewDelete && <SaleDeleteModal open={viewDelete} setViewDelete={setViewDelete} venta={row} />}
    </>
  );
}

const Sales = () => {
  const { productos } = useOutletContext();
  const [viewForm, setViewForm] = useState(false);
  const [sales, setSales] = useState([]);
  
  useEffect(() => {
    fetch("http://localhost:8081/ventas")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.text(); // Si el servidor retorna texto plano
      })
      .then((data) => {
        const lines = data.trim().split("\n");
        const salesParsed = lines.map((line) => {
          const [id, customer, total, ...products] = line.split(",");
          const productsParsed = [];
          for (let i = 0; i < products.length; i += 2) {
            productsParsed.push({
              name: products[i],
              quantity: products[i + 1],
            });
          }
          return createData(id, customer, total, productsParsed);
        });

        setSales(salesParsed);
      })
      .catch((error) => {
        console.error("Error al obtener las ventas:", error);
      });
  }, []);

  const handleAdd = ()=>{
    setViewForm(true);
  }

  return (
    <>
      <Button variant="contained" color="success" onClick={handleAdd}>
        Agregar
      </Button>
      <TableContainer component={Paper} sx={{ mb: 4, mt: 2 }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID venta</TableCell>
              <TableCell align="center">Cliente</TableCell>
              <TableCell align="center">Precio total</TableCell>
              <TableCell align="center">Opciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale) => (
              <Row key={sale.id} row={sale} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {viewForm && <SalesForm open={viewForm} setViewForm={setViewForm} productos={productos} totalSales = {sales.length} />}
      
    </>
  );
};

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    customer: PropTypes.string.isRequired,
    total: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        quantity: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Sales;
