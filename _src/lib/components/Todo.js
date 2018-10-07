import React, { Component } from 'react';
import ReactDom from 'react-dom';
import logo from './images/logo.svg';
import './css/Rapp.css';
import List from './List';
class Todo extends Component {

  state = {
    items: [],
    term : "",
  }

 onChange(event){
   this.setState({ term: event });
 }

 onDelete= (item) =>{
   this.state.items.splice(item, 1);
   this.setState({items: this.state.items});
 }

  onSubmit= (event) => {
    event.preventDefault();
    if (this.state.term.length > 0){
      this.setState({
        term: '',
        items: [...this.state.items, this.state.term]
      });
    }
  };

  render() {
    return (
      <div className="Appcenter">
      <img src={logo} className="App-logo" alt="logo" />
       <h3 className="Appheader"> TODO-LIST </h3>
       <div className='mainCenter'>
        <form className="App" onSubmit={this.onSubmit}>
          <input placeholder="add task" value={this.state.term} onChange={(e) => this.onChange(e.target.value)}
          className="inputField"/>
          <button className="btn btn--primary">Add</button>
        </form>
        <List items={this.state.items}  onDeleteList={this.onDelete}/>
        <div className="footer-outer">
          <span className="footer"> Completed Items:  {this.state.items.length} </span>
        </div>
      </div>
    </div>
    );
  }
}

ReactDom.render(<Todo/>, document.getElementById('todo'));