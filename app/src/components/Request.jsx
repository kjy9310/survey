import axios from "axios"
import Auth from './Auth'

const API_URL = "http://localhost:5000/api/"

function requestErrorHandle(response){
  console.log(response)
  if (response && response.status === 401) {
    window.location.replace("/login")
  } else {
    // window.location.replace("/")
    console.log("error response", response)
    alert(response)
  }
}

class Request {
  async get(endpoint){
    const headers = Auth.getHeader()
    const resultData = await axios.get(API_URL+endpoint, { headers })
      .then(response => {
        console.log('response', response)
        if(response.status===200){
          return response.data
        } else {
          requestErrorHandle(response)
          return 
        }
      }).catch((err)=>{
        console.log('!!!!ERR catched!!!!',err)
        requestErrorHandle(err.response)
      })
    console.log("resdata get", endpoint, '=>', resultData)
    return resultData
  }
  async post(endpoint, requestData){
    const headers = Auth.getHeader()
    const resultData = await axios.post(API_URL+endpoint, requestData ,{ headers })
    .then(response => {
      if(response.status===200){
        return response.data
      } else {
        requestErrorHandle(response)
        return 
      }
    }).catch((err)=>{
      console.log('!!!!ERR catched!!!!',err)
      requestErrorHandle(err.response)
    })
    console.log("resdata post", endpoint, '=>', resultData)
    return resultData
  }
  async put(endpoint, requestData){
    const headers = Auth.getHeader()
    const resultData = await axios.put(API_URL+endpoint, requestData ,{ headers })
    .then(response => {
      if(response.status===200){
        return response.data
      } else {
        requestErrorHandle(response)
        return 
      }
    }).catch((err)=>{
      console.log('!!!!ERR catched!!!!',err)
      requestErrorHandle(err.response)
    })
    console.log("resdata put", endpoint, '=>', resultData)
    return resultData
  }
  async delete(endpoint){
    const headers = Auth.getHeader()
    const resultData = await axios.delete(API_URL+endpoint, { headers })
    .then(response => {
      if(response.status===200){
        return response.data
      } else {
        requestErrorHandle(response)
        return 
      }
    }).catch((err)=>{
      console.log('!!!!ERR catched!!!!',err)
      requestErrorHandle(err.response)
    })
    console.log("resdata delete", endpoint, '=>', resultData)
    return resultData
  }
  
}

export default new Request();