import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api";
import styles from "../styles/Form.module.css"; // Asegúrate de importar el archivo de estilos

const EditHotel = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState({
    name: '',
    address: '',
    city: '',
    nit: '',
    max_rooms: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotel = async () => {
      const { data } = await axios.get(`/hotels/${id}`);
      setHotel(data);
    };
    fetchHotel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotel(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    try {
      await axios.put(`/hotels/${id}`, hotel);
      navigate("/"); // Redirige a la lista de hoteles usando navigate
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Error al actualizar el hotel:", error);
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Editar Hotel</h1>
      <form onSubmit={handleSubmit}>
        <input
          className={`${styles.inputField} ${errors.name ? styles.error : ''}`}
          type="text"
          name="name"
          value={hotel.name}
          onChange={handleChange}
          placeholder="Nombre del hotel"
          required
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}

        <input
          className={`${styles.inputField} ${errors.address ? styles.error : ''}`}
          type="text"
          name="address"
          value={hotel.address}
          onChange={handleChange}
          placeholder="Dirección"
          required
        />
        {errors.address && <p className={styles.errorText}>{errors.address}</p>}

        <input
          className={`${styles.inputField} ${errors.city ? styles.error : ''}`}
          type="text"
          name="city"
          value={hotel.city}
          onChange={handleChange}
          placeholder="Ciudad"
          required
        />
        {errors.city && <p className={styles.errorText}>{errors.city}</p>}

        <input
          className={`${styles.inputField} ${errors.nit ? styles.error : ''}`}
          type="text"
          name="nit"
          value={hotel.nit}
          onChange={handleChange}
          placeholder="NIT"
          required
        />
        {errors.nit && <p className={styles.errorText}>{errors.nit}</p>}

        <input
          className={`${styles.inputField} ${errors.max_rooms ? styles.error : ''}`}
          type="number"
          name="max_rooms"
          value={hotel.max_rooms}
          onChange={handleChange}
          placeholder="Habitaciones máximas"
          required
        />
        {errors.max_rooms && <p className={styles.errorText}>{errors.max_rooms}</p>}

        <button className={styles.button} type="submit">Actualizar Hotel</button>
      </form>
    </div>
  );
};

export default EditHotel;
