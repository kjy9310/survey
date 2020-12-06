import React from 'react';
import Auth from './Auth'
import axios from "axios";

class ManageSurvey extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: ''
    }
    this.headers = Auth.getHeader()
  }

  componentDidMount(){
    const res = axios.get("http://localhost:5000/api/survey", { headers:this.headers })
        .then(response => {
            return response.data;
        });
    console.log("resdata", res)
  }

  handleChange = (event) =>{
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const res = axios.post("http://localhost:5000/api/survey", { ...this.state },{ headers:this.headers })
    .then(response => {
        return response.data;
    });
    console.log("resdata", res)
  }
  
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            title:
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </label>
          <label>
            description:
            <input
              type="text"
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default ManageSurvey;
