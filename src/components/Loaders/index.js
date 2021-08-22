import Spinner from "react-bootstrap/Spinner";
const ViewBookLoader = ()=>{
    return (
        <div className="text-center my-3 py-3">
            <Spinner animation="border" variant="primary" />
        </div>
    )
}
export {ViewBookLoader}