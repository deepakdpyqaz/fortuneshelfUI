import React,{useState,useRef, useEffect} from "react";
import "./searchbar.scss";
import CancelIcon from '@material-ui/icons/Cancel';
import axios from "axios";
import { useAlert } from "react-alert";
import SearchIcon from "@material-ui/icons/Search";
import { useHistory } from "react-router-dom";
const SearchSuggestion = (props) => {
    return (
        <div className="fs_search_suggestion" onClick={props.onClick}>
            <object data={props.picture} type="image/jpg" height="50" width="50">
                <img src="https://fortuneshelfimages.s3.ap-south-1.amazonaws.com/media/books/default.png" height="50" width="50" alt={props.title} />
            </object>
            <h6>{props.title}</h6>
        </div>
    )
}
const SearchBar = (props) => {
    const history = useHistory();
    const alert = useAlert();
    const searchBarRef = useRef();
    const [query,setQuery] = useState("");
    const [suggestions,setSuggestions] = useState("");
    const [message,setMessage]=useState("Type something for search");
    const handleChange = (e) => {
        if(e.target.value.length<4){
            setMessage("Type something for search");
        }
        setQuery(e.target.value);
        if(e.target.value.length>3){
            axios.get("/book/search_suggestions",{params:{"query":e.target.value}}).then((res)=>{
                setSuggestions(res.data);
            }).catch((err)=>{
                alert.error(err.message);
            })
        }
    }
    const makeSearch = (e,title=null)=>{
        let searchQuery = title?title:query;
        if(searchQuery.length<4){
            setMessage("Enter atleast 4 characters");
            return;
        }

        props.handleClose();
        history.push({
            pathname:"/search",
            search:`?searchQuery=${title?title:query}`
        })
    }
    useEffect(()=>{
        if(searchBarRef.current){
            searchBarRef.current.focus();
        }
    })
    return (
        
            props.show?
                <>
                <div className="fs_search_full">
                    <button onClick={()=>{props.handleClose()}} className="fs_search_close"><CancelIcon className="fs_search_ico" style={{fontSize:"3rem"}}/></button>
                    <input autofocus ref={searchBarRef} type="text" className="fs_input_box" onKeyUp={(e)=>{if(e.key=="Enter"){makeSearch(e)}}} placeholder="Search Your Favourite Book" value={query} onChange={handleChange}/>
                    <SearchIcon className="fs_make_search" onClick={makeSearch} />
                    <div className="fs_search_suggestions">
                        {query.length<4?<h1>{message}</h1>:(
                            suggestions.length?
                            <>
                                <h3>You might be looking for</h3>
                                {
                                    suggestions.map((elem)=>{
                                        return <SearchSuggestion key={elem.index} onClick={(e)=>{makeSearch(e,elem.title)}} title={elem.title} picture={elem.picture}/>
                                    })
                                }
                            </>:<h3>No search suggestions</h3>
                        )}
                    </div>
                </div>
                </>
            :null
        
    )
}

export default SearchBar