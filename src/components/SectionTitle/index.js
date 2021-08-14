import "./sectiontitle.scss";
const SectionTitle = (props)=>{
    return(
        <>
            <div className="fs_section_title">
                <h2>{props.title}</h2>
            </div>
        </>
    )
}
export default SectionTitle;