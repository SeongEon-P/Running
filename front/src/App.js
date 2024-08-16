import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import TeamRegister from './components/teammanage/TeamRegister';
import TeamList from './components/teammanage/TeamList';
import TeamView from './components/teammanage/TeamView';
import TeamEdit from './components/teammanage/TeamEdit';

function App() {
  return (
   <Router>
    <Routes>
      <Route path = "/team/register" element = {<TeamRegister />} />
      <Route path = "/team/list" element = {<TeamList />} />
      <Route path = "/team/:teamName" element = {<TeamView />} />
      <Route path = "/team/edit/:teamName" element = {<TeamEdit />} />
    </Routes>
   </Router>
  );
}

export default App;
