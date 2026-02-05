import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OsmosisLab from './labs/OsmosisLab';
import AcidBaseLab from './labs/AcidBaseLab';
// function AcidBaseLab() {
//   return <h2>⚗️ Acid–Base Lab (Coming Soon)</h2>;
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/labs/osmosis" element={<OsmosisLab />} />
        <Route path="/labs/acid-bases" element={<AcidBaseLab />} />
      </Routes>
    </BrowserRouter>
  );
}
