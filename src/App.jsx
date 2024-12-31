import { Routes, Route } from 'react-router-dom';
import Hotels from './components/Hotels';
import AddHotel from './components/AddHotel';
import AddRoom from './components/AddRoom';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Hotels />} />
      <Route path="/add-hotel" element={<AddHotel />} />
      <Route path="/add-room/:hotelId" element={<AddRoom />} />
    </Routes>
  );
};

export default App;
