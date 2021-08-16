import dotenv from "dotenv";
dotenv.config();
const configs={
    backendUrl: process.env.REACT_APP_backendUrl||"http://localhost:8000/"
}

export default configs;