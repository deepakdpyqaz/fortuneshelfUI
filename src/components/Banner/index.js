import {useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import banner1 from "../../images/banner/banner1-min.jpg";
import banner2 from "../../images/banner/banner2-min.jpg";
import banner3 from "../../images/banner/banner3-min.jpg";
import banner4 from "../../images/banner/banner4-min.jpg";
const Banner = () => {
    const [height,setHeight]=useState(450);
    useEffect(()=>{
        setHeight(Math.min(Math.min(600,window.innerHeight),Math.max(window.innerWidth/1.5,350)));
    })
    return (
        <Carousel fade>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={banner1}
                    alt="First slide"
                    height={height}
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={banner2}
                    alt="Second slide"
                    height={height}
                />

            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={banner3}
                    alt="Third slide"
                    height={height}
                />

            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={banner4}
                    alt="fourth slide"
                    height={height}
                />

            </Carousel.Item>
        </Carousel>
    )
}

export default Banner;