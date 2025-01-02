import { Routes, Route } from 'react-router-dom';
import Hotels from './components/Hotels';
import AddHotel from './components/AddHotel';
import AddRoom from './components/AddRoom';
import EditHotel from './components/EditHotel';
import EditRoom from './components/EditRoom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hotels />} />
      <Route path="/add-hotel" element={<AddHotel />} />
      <Route path="/add-room/:hotelId" element={<AddRoom />} />
      <Route path="/edit-hotel/:id" element={<EditHotel/>} />
      <Route path="/edit-room/:id" element={<EditRoom/>} />
    </Routes>
  );
};

export default App;
