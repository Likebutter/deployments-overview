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
        <Button variant="outline-warning">Restart appserver</Button>
        <Button variant="outline-danger">Load dump</Button>
        <Button variant="outline-info">Info</Button>
      </ButtonToolbar>
    </div>
  ),
  onExpand: (row, isExpand, rowIndex, e) => {
    expandedRow = row
  },
};

export class Ibs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {dataField: "color", text: "STATUS", sort: true, formatter: this.imgFormatter},
        {dataField: "name", text: "name", sort: true},
        {dataField: "url", text: "url", sort: true, formatter: this.linkFormatter},
      ],
      data: [],
      jobs: []
    }
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs() {
    DeploymentsService.getJobs("/jenkins/jobs/ibs").then((resp) => {
      console.log(resp)
      this.setState({ jobs: resp.jobs })
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
          keyField='name'
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