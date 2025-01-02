import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "react-query"; // Importar hooks de react-query
import axios from "../api";
import styles from "../styles/Form.module.css"; // Asegúrate de importar el archivo de estilos

const EditRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({
    type: '',
    accommodation: '',
    quantity: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar errores
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Cargar los datos de la habitación a editar
  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await axios.get(`/rooms/${id}`);
      setRoom(data);
    };
    fetchRoom();
  }, [id]);

  // Definir la mutación para actualizar la habitación
  const mutation = useMutation(
    (updatedRoom) => axios.put(`/rooms/${id}`, updatedRoom), // Usar la API PUT para actualizar
    {
      onSuccess: () => {
        queryClient.invalidateQueries("rooms"); // Invalidar la caché para que los datos se actualicen
        navigate("/"); // Redirigir a la lista de habitaciones
      },
      onError: (error) => {
        const message = error.response?.data?.error || "Error al actualizar la habitación.";
        setErrorMessage(message); // Establecer el mensaje de error
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Limpiar cualquier error previo

    // Intentar actualizar la habitación
    mutation.mutate(room);
  };

  return (
    <div className={styles.formContainer}>
      <h1>Editar Habitación</h1>
      <form onSubmit={handleSubmit}>
        {/* Mostrar el mensaje de error si hay uno */}
        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        {/* Campo de tipo de habitación deshabilitado */}
        <input
          className={`${styles.inputField} ${errorMessage ? styles.error : ''}`}
          type="text"
          name="type"
          value={room.type}
          onChange={handleChange}
          placeholder="Tipo de habitación"
          disabled  // Deshabilitar para que no se pueda editar
        />

        <input
          className={`${styles.inputField} ${errorMessage ? styles.error : ''}`}
          type="text"
          name="accommodation"
          value={room.accommodation}
          onChange={handleChange}
          placeholder="Acomodación"
          required
        />

        <input
          className={`${styles.inputField} ${errorMessage ? styles.error : ''}`}
          type="number"
          name="quantity"
          value={room.quantity}
          onChange={handleChange}
          placeholder="Cantidad de habitaciones"
          required
        />

        <button
          type="submit"
          className={styles.button}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Actualizando..." : "Actualizar Habitación"}
        </button>
      </form>
    </div>
  );
};

export default EditRoom;
