import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigation } from './components/Navigation'
import { Ibs } from './components/Ibs'

function IbsComponent() {
  return (
    <div className="App">
      <header className="App-header">
        <Navigation></Navigation>
      </header>
      <div className="App-container">
        <Ibs></Ibs>
      </div>
    </div>
  )
}

export default IbsComponent;
