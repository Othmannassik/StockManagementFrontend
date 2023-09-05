import axios from "axios";

const http=axios.create({
    baseURL:"http://localhost:8081",
    headers: {"content-type":"Application/json"}
})

export default http