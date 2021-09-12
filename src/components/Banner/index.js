import {useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import banner1 from "../../images/banner/1.png";
import banner2 from "../../images/banner/2.png";
import banner3 from "../../images/banner/3.png";
import banner4 from "../../images/banner/4.png";
import banner5 from "../../images/banner/5.png";
import banner6 from "../../images/banner/6.png";
import banner7 from "../../images/banner/7.png";
import banner8 from "../../images/banner/8.png";
import banner9 from "../../images/banner/9.png";
import banner10 from "../../images/banner/10.png";
const Banner = () => {
    const [height,setHeight]=useState(450);
    useEffect(()=>{
        setHeight(Math.min(Math.min(600,window.innerHeight),Math.max(window.innerWidth/1.5,350)));
    });
    const images = [banner1,banner2,banner3,banner4,banner5,banner6,banner7,banner8,banner9,banner10]
    return (
        <Carousel fade>
            {
                images.map((img,ind)=>{
                    return (
                        <Carousel.Item key={ind}>
                        <img
                            className="d-block w-100"
                            src={img}
                            alt={`slide ${ind+1}`}
                            height={height}
                        />
                    </Carousel.Item>
                    )
                })
            }

        </Carousel>
    )
}

export default Banner;