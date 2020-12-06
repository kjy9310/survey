import axios from "axios";

const API_URL = "http://localhost:5000/api/"

class Auth {
  login({username, password}, loginCallback) {
    return axios
      .post(API_URL + "signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        loginCallback(response.data)
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register({username, password}) {
    return axios.post(API_URL + "signup", {
      username,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
  
  getHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('getHeader', user)
    if (user && user.token) {
      console.log('getHeader if', user)
      return { Authorization: 'Bearer ' + user.token };
    } else {
      return {};
    }
  }
  
}

export default new Auth();