import { useState } from "react";
import { useQuery } from "react-query";
import axios from "../api";
import { Link } from "react-router-dom";
import styles from "../styles/Hotels.module.css";

const fetchHotels = async () => {
  const { data } = await axios.get('/hotels');
  return data;
};

const Hotels = () => {
  const { data, isLoading, error } = useQuery('hotels', fetchHotels);
  const [selectedHotel, setSelectedHotel] = useState(null);

  if (isLoading) return <p>Cargando hoteles...</p>;
  if (error) return <p>Error al cargar los hoteles.</p>;

  return (
    <div className={styles.container}>
      <h1>Hoteles</h1>
      <Link to="/add-hotel" className={styles.link}>
        Agregar Hotel
      </Link>
      <ul>
        {data.map(hotel => (
          <li key={hotel.id} className={styles.hotelCard}>
            <h3>{hotel.name}</h3>
            <p>{hotel.address}, {hotel.city}</p>
            <p>NIT: {hotel.nit} | Habitaciones máximas: {hotel.max_rooms}</p>
            <button
              className={styles.button}
              onClick={() => setSelectedHotel(hotel.id)}
            >
              {selectedHotel === hotel.id ? 'Ocultar Habitaciones' : 'Ver Habitaciones'}
            </button>
            {selectedHotel === hotel.id && (
              <ul>
                {hotel.rooms.length > 0 ? (
                  hotel.rooms.map(room => (
                    <li key={room.id}>
                      {room.type} - {room.accommodation}: {room.quantity} habitaciones
                    </li>
                  ))
                ) : (
                  <p>No hay habitaciones registradas.</p>
                )}
                <Link to={`/add-room/${hotel.id}`} className={styles.link}>
                  Agregar Habitación
                </Link>
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hotels;