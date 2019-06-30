import React from 'react'

const PATH_BASE = 'https://hn.algolia.com/api/v1'
const PATH_SEARCH = '/search'
const PARAM_SEARCH = 'query='
const PARAM_PAGE = 'page='
const PARAM_HPP = 'hitsPerPage='
const DEFAULT_HPP = '100'

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />
    <button type="submit">
      {children}
    </button>
  </form>

class Button extends React.Component { 
  render() {
    const { onClick, className, children,
    } = this.props
    return ( 
      <button
        onClick={onClick}
        className={className}
        type="button"
      >
        {children}
      </button>
    )
  } 
}

class Table extends React.Component {
  render() {
    const { list, onDismiss } = this.props
    return (
      <div className="table">
        {list.map(item =>
          <div className="table-row" key={item.objectID}>
            <span>
              <a href={item.url}>{item.title}</a>
            </span>
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            <span>
              <button
                onClick={() => onDismiss(item.objectID)}
                type="button"
                className="button-inline"
              > Dismiss
              </button>
            </span>
          </div> )}
      </div> )
  } 
}

class Pagination extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      result: null,
      searchTerm: '',
    }
    this.setSearchTopStories = this.setSearchTopStories.bind(this)
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
  }

  setSearchTopStories(result) {
    const { hits, page } = result
    const oldHits = page !== 0 ? this.state.result.hits: []
    const updatedHits = [...oldHits, ...hits]
    this.setState({result: { hits: updatedHits, page }})
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  }


  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state
    this.fetchSearchTopStories(searchTerm)
    event.preventDefault()
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id
    const updatedHits = this.state.result.hits.filter(isNotId)
    this.setState({
      result: Object.assign({}, this.state.result, { hits: updatedHits })
    }) 
  }
  componentDidMount() {
    const { searchTerm, result } = this.state
    this.fetchSearchTopStories(searchTerm)
  }
  render() {
    const { searchTerm, result } = this.state
    const page = (result && result.page) || 0
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm} 
            onChange={this.onSearchChange} 
            onSubmit={this.onSearchSubmit}
          > Search
          </Search>
        </div>
        { result &&
          <Table
            list={result.hits}
            onDismiss={this.onDismiss}
          /> }
        <div className="interactions">
          <Button onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
            More
          </Button>
        </div>
      </div> )
  }
}
export default Pagination