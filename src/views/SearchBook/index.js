import React, { useState, useEffect } from "react";
import { BookContainer } from "../../components/ViewBook";
import axios from "axios";
import {useLocation,useParams} from "react-router-dom";
import {ViewBookLoader, viewBookLoader} from "../../components/Loaders";
function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  
const SearchBook = () => {
    const params = useParams();
    const location = useLocation();
    const [books, setBooks] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const query = useQuery();
    useEffect(()=>{
        setIsLoading(true);
        axios.get("/book/search",{params:{"query":query.get("searchQuery")}}).then((res)=>{
            setBooks(res.data);
        }).catch((err)=>{
            alert(err.message);
        }).finally(()=>{
            setIsLoading(false);
        })
    },[location.search])
    return (
        <div className="searchBook" style={{ paddingTop: "10vh" }}>
            <h3 className="text-center my-3">Search results for <em>"{query.get("searchQuery")}"</em></h3>
            {(!isLoading?
                (
                    books.length!=0?
                        <BookContainer books={books}/>
                    : <h3 className="my-3 text-center">No Books found</h3>
                ):
                <ViewBookLoader/>
            )}
        </div>
    )
}

export default SearchBook;