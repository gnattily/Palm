import axios from "axios";

axios.get("blahblahblah")
    .then (() => {
        // do something
    })
    .catch((error) => {
        console.log(error);
    })