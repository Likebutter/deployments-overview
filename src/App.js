import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigation } from './components/Navigation'
import { Deployments } from './components/Deployments'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navigation></Navigation>
      </header>
      <div className="App-container">
        <Deployments></Deployments>
      </div>
    </div>
  );
}

export default App;
