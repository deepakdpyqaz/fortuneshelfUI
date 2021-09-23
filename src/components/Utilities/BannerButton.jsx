
const BannerButton = (props) => {
    return (
        <button className="fs_banner_button">{props.children} <span className="fs_banner_icon">{props.icon}</span></button>
    )
}
export default BannerButton;