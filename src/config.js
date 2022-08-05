import dotenv from "dotenv";
dotenv.config();
const configs={
    backendUrl: process.env.REACT_APP_backendUrl||"https://fortuneshelfserver.herokuapp.com/"
}

export default configs;