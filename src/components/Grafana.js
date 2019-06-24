import React from 'react'

export class Grafana extends React.Component {

  componentDidMount() {
    //this.fetchDashboard()
  }

  render() {
    return (
      <div className="GrafanaDashboard">
       <iframe src="https://grafana.coconet.de/d-solo/000000062/tcd-deployments-all-telegraf?orgId=1&panelId=1&from=1560942713523&to=1560943013524&theme=light" width="90%" height="600" frameborder="0"></iframe>
       </div>
    );
  }
}