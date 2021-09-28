import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {BannerButton} from "../../components/Utilities";
import Carousel from "react-bootstrap/Carousel";
import Avatar from "@material-ui/core/Avatar";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { makeStyles } from "@material-ui/styles";
import Roll from 'react-reveal/Roll';
import banner0 from "../../images/banner/0.png";
import banner1 from "../../images/banner/1.png";
import banner2 from "../../images/banner/2.png";
import banner3 from "../../images/banner/3.png";
import banner4 from "../../images/banner/4.png";
import banner5 from "../../images/banner/5.png";
import banner6 from "../../images/banner/6.png";
import banner7 from "../../images/banner/7.png";
import banner8 from "../../images/banner/8.png";

const useStyles = makeStyles((theme)=>({
    wrapper:{
        backgroundColor:"#1A2238",
        width:"3rem",
        height:"3rem"
    },
    icon:{
        color:"#EBA83A",
        fontSize:"3rem"
    }
}))

const Banner = () => {
    const [height, setHeight] = useState(0);
    const classes = useStyles();
    useEffect(() => {
        setHeight(Math.min(Math.min(450, window.innerHeight), Math.max(window.innerWidth / 2, 250)));
    },[]);
    const bannerLeft = (
        <Avatar className={classes.wrapper}>
        <ChevronLeftIcon className={classes.icon}/>
    </Avatar>
    )
    const bannerRight = (
        <Avatar className={classes.wrapper}>
        <ChevronRightIcon className={classes.icon}/>
    </Avatar>
    )
    const images = [
        {"image":banner0},
        {
            "image":banner1,
            "text":"Get your favourite books",
            "link":{pathname:"/viewBook",state:{"language":"hindi"}}
        },
        {
            "image":banner2,
        },
        {
            "image":banner3,
        },{
            "image":banner4,
            "link":{pathname:"/viewBook",state:{"category":"gita"}},
            "text":"Buy gita now"
        },
        {
            "image":banner5
        },
        {
            "image":banner6
        },
        {
            "image":banner7
        },
        {
            "image":banner8
        },
        
    ]
    return (
        <Carousel fade variant="dark" nextIcon={bannerRight} prevIcon={bannerLeft}>
            {
                images.map((img, ind) => {
                    return (
                        <Carousel.Item key={ind} interval={2000}>
                            {height ?
                                <img
                                    className="d-block w-100"
                                    src={img.image}
                                    alt={`slide ${ind + 1}`}
                                    height={height}
                                />
                                : null}
                            {
                                img.link?
                                <Carousel.Caption>
                                    <Roll left>
                                    <Link to={img.link}><BannerButton>{img.text}</BannerButton></Link>
                                </Roll>
                                </Carousel.Caption>
                                :null
                            }
                        </Carousel.Item>
                    )
                })
            }

        </Carousel>
    )
}

export default Banner;