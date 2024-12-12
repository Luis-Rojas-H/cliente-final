import { Box, Button, ButtonGroup, Modal, Typography } from '@mui/material'
import PropTypes from "prop-types";

const DeleteModal = ({ open, setViewDelete, product }) => {

    const handleCloseModal = () => {
        setViewDelete(false);
    };

    const handleDelete = () => {
        fetch(`http://localhost:8080/productos/${product.idProd}`, {
            method: "DELETE",
        })
        .then((response) => {
            if (response.ok) {
                alert("Producto eliminado con éxito");
                setViewDelete(false);
            } else {
                alert("Error al eliminar el producto");
            }
        })
        .catch((error) => console.error("Error:", error));
    };
  return (
    <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Confirmar eliminación
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            ¿Estás seguro de que deseas eliminar el producto {product?.nameProd}?
          </Typography>
          <ButtonGroup sx={{ mt: 2 }}>
            <Button onClick={handleDelete} variant="contained" color="error">Eliminar</Button>
            <Button onClick={handleCloseModal} variant="contained">Cancelar</Button>
          </ButtonGroup>
        </Box>
      </Modal>
  )
}

DeleteModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setViewDelete: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
};

export default DeleteModal