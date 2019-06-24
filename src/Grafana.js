import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navigation } from './components/Navigation'
import { Grafana } from './components/Grafana'

function GrafanaComponent() {
  return (
    <div className="App">
      <header className="App-header">
        <Navigation></Navigation>
      </header>
      <div className="App-container">
        <Grafana></Grafana>
      </div>
    </div>
  )
}

export default GrafanaComponent;