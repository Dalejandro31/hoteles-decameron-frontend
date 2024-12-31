import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../api';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Form.module.css';

const AddHotel = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    nit: '',
    max_rooms: '',
  });
  const [errorMessage, setErrorMessage] = useState(''); // Para mostrar errores
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    newHotel => axios.post('/hotels', newHotel),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hotels');
        navigate('/');
      },
      onError: (error) => {
        // Verifica si el error tiene un mensaje específico desde el backend
        const message = error.response?.data?.error ||  // Verifica el error del backend
                        error.response?.data?.message || 
                        'Error al crear el hotel.';
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
    mutation.mutate(formData);  // Enviar los datos al backend
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1>Agregar Hotel</h1>
      
      {/* Mostrar el mensaje de error si hay uno */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <input
        type="text"
        name="name"
        placeholder="Nombre"
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Dirección"
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="text"
        name="city"
        placeholder="Ciudad"
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="text"
        name="nit"
        placeholder="NIT"
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <input
        type="number"
        name="max_rooms"
        placeholder="Máximo de habitaciones"
        onChange={handleChange}
        className={styles.inputField}
        required
      />
      <button type="submit" className={styles.button} disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default AddHotel;
