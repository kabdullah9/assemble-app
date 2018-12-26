import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';

const BookComponent = (props) => {
  const getAuthor = props.authors ? props.authors[0] : "";
  return (
    <div className="card col-2 cardMargin">
      <img className="card-img-top" src={props.src} alt="Card image cap" />
      <div className="card-body col-12">
        <h6 className="card-text"><b>{props.title}</b></h6>
        <p className="card-text">{getAuthor}</p>
      </div>
    </div>
  )
}

const RowComponent = (props) => {
  return (
    <ul className="row title thumbnails">
      <li>
        <h4>Titles A-M</h4>
        <div className='row'>
          {props.books.map((book, index) => {
            return <BookComponent key={index} {...book} />
          })}
        </div>
        <br />
        <div className="col-12 text-center">
          <a className="btn btn-primary">Show More</a>
        </div>
      </li>
    </ul>
  )
}

class App extends Component {
  state = {
    amBooks: [],
    nzBooks: [],
    userInput: '',
  }

  searchApi = (q = "tech%5D") => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${q}`
    return axios.get(url).then(({ data }) => {
      const books = data.items.reduce((acc, cv) => {
        const { title, authors, imageLinks } = cv.volumeInfo
        const getSrc = () => {
          if (imageLinks !== undefined) return imageLinks.smallThumbnail
          return "http://halffullmarketing.site/wp-content/uploads/2017/07/coming-soon.png"
        }
        const bookInfo = { title, authors, src: getSrc() }
        const firstCharTitleLetter = title[0].toLowerCase();
        const amLetters = ["a", "b", "c", "d", "e", "f", "g", " h", "i", "j", "k", "l", "m"];
        if (amLetters.includes(firstCharTitleLetter)) {
          return ({ ...acc, amBooks: [...acc.amBooks, bookInfo] })
        } else {
          return ({ ...acc, nzBooks: [...acc.nzBooks, bookInfo] })
        }
      }, { amBooks: [], nzBooks: [] })

      console.log("Georgia Tech" > "Live Work Work Work Die")

      return this.setState({
        amBooks: books.amBooks.sort((a, b) => a.title > b.title),
        nzBooks: books.nzBooks.sort((a, b) => a.title > b.title)
      })
    }).catch(err => {
      console.log(err)
    })
  };

  componentDidMount = () => {
    return this.searchApi();
  }

  handleInputText = (event) => {
    console.log(event.target.value)
    return this.setState({
      userInput: event.target.value
    });
  }

  handleSearchClick = () => {
    console.log(this.state.userInput, "input")
    return this.searchApi(this.state.userInput)
  }

  render() {
    console.log(this.state)
    return (
      <div className="App container-fluid">
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between">
            <a className="navbar-brand"><h5>Assemble Books</h5></a>
            <div>
              <input onChange={this.handleInputText}></input>
              <button onClick={this.handleSearchClick}>Search</button>
            </div>
          </nav>
          <br />
          <h2>Books</h2>
        </div>
        <RowComponent books={this.state.amBooks} />
        <RowComponent books={this.state.nzBooks} />
        <div class="row card-footer text-muted">
          <h6 className="col-4">Assemble</h6>
          <div className='col-8'>
            {new Array(9).fill({}).map((item, index) => {
              return (
                <div>
                  <ul>
                    <li className='col-4'>
                      <a href="" key={index}>link</a>
                    </li>
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div >
    );
  }
}

export default App;
