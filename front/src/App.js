import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import TeamRegister from './components/teammanage/TeamRegister';

function App() {
  return (
   <Router>
    <Routes>
      <Route path = "/team/register" element = {<TeamRegister />} />
    </Routes>
   </Router>
  );
}

export default App;
