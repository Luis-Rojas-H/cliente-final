import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { ShoppingBagOutlined } from "@mui/icons-material";
import StorageIcon from '@mui/icons-material/Storage';
import { useEffect, useState } from "react";


const Home = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const handleStore = () => {
    navigate("/store");
  };
  const handleSales = () => {
    navigate("/sales");
  };

  useEffect(() => {
    fetch("http://192.168.37.10:8080/productos")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.text(); // Si el servidor retorna texto plano
  })
  .then((data) => {
    const lines = data.trim().split("\n").filter(line => line.trim() !== "");
    const productosParseados = lines.map((line) => {
      const [idProd, nameProd, detail, amount, cost] = line.split(",");
      return { idProd, nameProd, detail, amount, cost };
    });

    setProductos(productosParseados);
  })
  .catch((error) => {
    console.error("Error al obtener los productos:", error);
  });
  }, []);

  return (
    <Container sx={{ bgcolor: "lightblue", my:5 }}>
      <Typography variant="h2" sx={{ textAlign: "center" }}>
        Sistema Distribuido de Servicios
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ButtonGroup size="large" aria-label="Basic button group">
        <Button
          onClick={handleStore}
          variant="contained"
          endIcon={<StorageIcon />}
        >
          Store
        </Button>
        <Button
          onClick={handleSales}
          variant="contained"
          endIcon={<ShoppingBagOutlined />}
        >
          Sales
        </Button>
      </ButtonGroup>
      </Box>
      <br />
      <Outlet context={{ productos }} />
      <br />
    </Container>
  );
};

export default Home;
