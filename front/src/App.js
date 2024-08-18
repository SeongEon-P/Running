import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import TeamRegister from './components/teammanage/TeamRegister';
import TeamList from './components/teammanage/TeamList';
import TeamView from './components/teammanage/TeamView';
import TeamEdit from './components/teammanage/TeamEdit';
import IncruitRegister from './components/incruit/IncruitRegister';
import IncruitList from './components/incruit/IncruitList';
import IncruitView from './components/incruit/IncruitView';
import IncruitEdit from './components/incruit/IncruitEdit';

function App() {
  return (
   <Router>
    <Routes>
      <Route path = "/team/register" element = {<TeamRegister />} />
      <Route path = "/team/list" element = {<TeamList />} />
      <Route path = "/team/:teamName" element = {<TeamView />} />
      <Route path = "/team/edit/:teamName" element = {<TeamEdit />} />

      <Route path = "/incruit/register" element = {<IncruitRegister />} />
      <Route path = "/incruit/list" element = {<IncruitList />} />
      <Route path = "/incruit/:ino" element = {<IncruitView />} />
      <Route path = "/incruit/edit/:ino" element = {<IncruitEdit />} />
    </Routes>
   </Router>
  );
}

export default App;
