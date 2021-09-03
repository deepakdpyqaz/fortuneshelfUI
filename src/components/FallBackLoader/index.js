import "./fallback.scss";
const FallBackLoader = () => {

    return (
        <div className="view_page" onScroll={(e)=>{e.preventDefault()}}>
            <div className="sk-chase-wrapper">
                <div className="sk-chase">
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                    <div className="sk-chase-dot"></div>
                </div>
            </div>
        </div>
    )
}
export default FallBackLoader;