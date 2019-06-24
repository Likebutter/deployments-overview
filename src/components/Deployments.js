import React from 'react'
import { ButtonToolbar, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next'
import ToolkitProvider, { ColumnToggle, Search } from 'react-bootstrap-table2-toolkit'
import DeploymentsService from '../services/DeploymentsService'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'

const { ToggleList } = ColumnToggle
const { SearchBar } = Search

var expandedRow

const expandRow = {
  onlyOneExpanding: true,
  renderer: row => (
    <div>
      <ButtonToolbar>
        <Button variant="outline-warning" onClick={() => DeploymentsService.restartAppserver(expandedRow.JOB_URL)}>Restart appserver</Button>
        <Button variant="outline-dark" onClick={() => DeploymentsService.migrateDatabase(expandedRow.JOB_URL)}>Migrate database</Button>
        <Button variant="outline-danger" onClick={() => DeploymentsService.restartAppserver(expandedRow.JOB_URL)}>Recreate database</Button>
        <Button variant="outline-info">Info</Button>
      </ButtonToolbar>
    </div>
  ),
  onExpand: (row, isExpand, rowIndex, e) => {
    expandedRow = row
  },
};

export class Deployments extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {dataField: "color", text: "STATUS", sort: true, formatter: this.imgFormatter},
        {dataField: "JOB_URL", text: "JOB_URL", sort: true, formatter: this.linkFormatter},
        {dataField: "VERSION", text: "VERSION", sort: true},
        {dataField: "DATASET", text: "DATASET", sort: true, hidden: true},
        {dataField: "NODE_NAME", text: "NODE_NAME", sort: true},
        {dataField: "APPSERVER", text: "APPSERVER", sort: true},
        {dataField: "DATABASE_SKIP", text: "DATABASE_SKIP", sort: true, hidden: true},
        {dataField: "BUILD_URL", text: "BUILD_URL", sort: true, hidden: true, formatter: this.linkFormatter},
        {dataField: "DEFAULT_DATABASE_HANDLING", text: "DEFAULT_DATABASE_HANDLING", sort: true, hidden: true},
        {dataField: "CUSTOMER", text: "CUSTOMER", sort: true},
        {dataField: "ADDITIONAL_PROFILES", text: "ADDITIONAL_PROFILES", sort: true, hidden: true},
        {dataField: "DEBUG_MODE", text: "DEBUG_MODE", sort: true, hidden: true},
        {dataField: "DB_USER", text: "DB_USER", sort: true, hidden: true},
        {dataField: "GIT_BRANCH", text: "GIT_BRANCH", sort: true, hidden: true},
        {dataField: "BASE_PROFILES", text: "BASE_PROFILES", sort: true, hidden: true},
        {dataField: "DB_HOST", text: "DB_HOST", sort: true}
      ],
      data: [],
      jobs: []
    }
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs() {
    DeploymentsService.getJobs("/jenkins/jobs").then((resp) => {
      this.setState({ jobs: resp })
    })
  }

  linkFormatter(cell, row) {
    return (<a href={ cell } target="_blank" rel="noopener noreferrer">{ cell }</a>)
  }

  imgFormatter(cell, row) {
    return (<img src={ `/img/${cell}.png` } />)
  }

  render() {
    return (
      <div className="Deployments">
        <ToolkitProvider
          keyField='JOB_URL'
          data={this.state.jobs}
          columns={this.state.columns}
          columnToggle
          onColumnToggle
          search
        >
         {
          props => {
            let extendedProps = props.baseProps
            extendedProps.expandRow = expandRow
            return (
            <div>
              <SearchBar { ...props.searchProps } />
              <ToggleList { ...props.columnToggleProps } />
              <hr />
              <BootstrapTable
                { ...extendedProps }
              />
            </div>
          )}
        }
        </ToolkitProvider>
      </div>
    );
  }
}