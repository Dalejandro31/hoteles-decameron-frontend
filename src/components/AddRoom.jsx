import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.css';

const AddRoom = () => {
  const { hotelId } = useParams();
  const [formData, setFormData] = useState({
    type: '',
    accommodation: '',
    quantity: '',
    hotel_id: hotelId,
  });
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar errores
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Opciones de acomodación disponibles para todos los tipos de habitación
  const accommodationOptions = ['Sencilla', 'Doble', 'Triple', 'Cuadruple'];

  const mutation = useMutation(
    newRoom => axios.post('/rooms', newRoom),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hotels');
        navigate('/');
      },
      onError: (error) => {
        // Verifica si el error tiene un mensaje específico desde el backend
        const message = error.response?.data?.error || 'Error al crear la habitación.';
        setErrorMessage(message);  // Establece el mensaje de error
      },
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');  // Limpiar cualquier error previo

    // Aquí no filtramos las opciones, pero validamos después del envío
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>Agregar Habitación</h1>

      {/* Mostrar el mensaje de error si hay uno */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <select
        name="type"
        onChange={handleChange}
        className={styles.selectField}
        required
      >
        <option value="">Seleccionar Tipo</option>
        <option value="Standard">Estándar</option>
        <option value="Junior">Junior</option>
        <option value="Suite">Suite</option>
      </select>

      <select
        name="accommodation"
        onChange={handleChange}
        className={styles.selectField}
        required
      >
        <option value="">Seleccionar Acomodación</option>
        {accommodationOptions.map((accommodation) => (
          <option key={accommodation} value={accommodation}>
            {accommodation}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="quantity"
        placeholder="Cantidad"
        onChange={handleChange}
        className={styles.inputField}
        required
      />

      <button
        type="submit"
        className={styles.button}
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default AddRoom;
