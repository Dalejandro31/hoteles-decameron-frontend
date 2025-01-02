import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "../api";
import { Link } from "react-router-dom";
import styles from "../styles/Hotels.module.css";

// Función para obtener los hoteles
const fetchHotels = async () => {
  const { data } = await axios.get('/hotels');
  return data;
};

const Hotels = () => {
  const { data, isLoading, error } = useQuery('hotels', fetchHotels);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const queryClient = useQueryClient();

  // Mutación para eliminar un hotel
  const deleteHotelMutation = useMutation(
    (hotelId) => axios.delete(`/hotels/${hotelId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hotels'); // Refresca la lista de hoteles después de eliminar
      },
      onError: () => {
        alert("Error al eliminar el hotel.");
      }
    }
  );

  // Mutación para eliminar una habitación
  const deleteRoomMutation = useMutation(
    (roomId) => axios.delete(`/rooms/${roomId}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('hotels'); // Refresca los hoteles después de eliminar la habitación
      },
      onError: () => {
        alert("Error al eliminar la habitación.");
      }
    }
  );

  // Función para manejar la eliminación de un hotel
  const handleDeleteHotel = (hotelId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este hotel?")) {
      deleteHotelMutation.mutate(hotelId);
    }
  };

  // Función para manejar la eliminación de una habitación
  const handleDeleteRoom = (roomId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta habitación?")) {
      deleteRoomMutation.mutate(roomId);
    }
  };

  if (isLoading) return <p>Cargando hoteles...</p>;
  if (error) return <p>Error al cargar los hoteles.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hoteles</h1>
      <Link to="/add-hotel" className={styles.link}>
        <button className={styles.addHotelButton}>Agregar Hotel</button>
      </Link>

      <div className={styles.hotelsList}>
        {data.map(hotel => (
          <div key={hotel.id} className={styles.hotelCard}>
            <div className={styles.hotelHeader}>
              <h3>{hotel.name}</h3>
              <p className={styles.hotelLocation}>{hotel.address}, {hotel.city}</p>
              <p className={styles.hotelInfo}>NIT: {hotel.nit} | Habitaciones máximas: {hotel.max_rooms}</p>
            </div>

            <div className={styles.hotelActions}>
              <button
                className={styles.button}
                onClick={() => setSelectedHotel(selectedHotel === hotel.id ? null : hotel.id)}
              >
                {selectedHotel === hotel.id ? 'Ocultar Habitaciones' : 'Ver Habitaciones'}
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteHotel(hotel.id)}
              >
                Eliminar Hotel
              </button>
              <button
                className={styles.button}
                onClick={() => window.location.href = `/edit-hotel/${hotel.id}`}
              >
                Editar Hotel
              </button>
            </div>

            {selectedHotel === hotel.id && (
              <div className={styles.roomsSection}>
                <h4>Habitaciones</h4>
                <ul>
                  {hotel.rooms.length > 0 ? (
                    hotel.rooms.map(room => (
                      <li key={room.id} className={styles.roomCard}>
                        <span>{room.type} - {room.accommodation}: {room.quantity} habitaciones</span>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          Eliminar Habitación
                        </button>
                        <button
                          className={styles.button}
                          onClick={() => window.location.href = `/edit-room/${room.id}`}
                        >
                          Editar Habitación
                        </button>
                      </li>
                    ))
                  ) : (
                    <p>No hay habitaciones registradas.</p>
                  )}
                </ul>
                <Link to={`/add-room/${hotel.id}`} className={styles.link}>
                  <button className={styles.addRoomButton}>Agregar Habitación</button>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
