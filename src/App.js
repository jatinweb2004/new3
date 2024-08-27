import React from 'react';
import './App.css';
import Navbar from './components/header/Navbar';

import Profile from './components/pages/Profile/Profile';
import AppRoutes from './AppRoutes';
import Problem from './components/pages/Problem/Problem';
import AskQuery from './components/pages/Query/AskQuery';

function App() {
  return (
    <div className="App">
      <AppRoutes/>
    </div>
  );
}

export default App;