import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import axios from "axios";
const Book = ()=>{
    const history = useHistory();
    const admin = useSelector((state)=>state.admin.adminDetails);
    if(!(admin && admin.id)){
        history.push("/admin/login")
    }
    return (
        <div>
            
        </div>
    )
}

export default Book;