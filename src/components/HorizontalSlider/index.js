import React, { useRef, useState } from "react";
import "./horizontal_slider.scss";
import { Book } from "../../components/ViewBook";
import SectionTitle from "../SectionTitle";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
const HorizontalSlider = (props) => {
    const sliderRef = useRef();
    const slide = (direction) => {
        if (sliderRef.current) {
            if (direction == 1) {
                if (sliderRef.current.scrollLeft + sliderRef.current.getBoundingClientRect().width < sliderRef.current.scrollWidth - 230)
                    sliderRef.current.scrollBy({
                        left: 230,
                        top: 0,
                        behavior: "smooth"
                    });
                else {
                    sliderRef.current.scrollTo({
                        left: 0,
                        top: 0,
                        behavior: "smooth"
                    })
                }
            } else {
                if (sliderRef.current.scrollLeft > 50)
                    sliderRef.current.scrollBy({
                        left: -100,
                        top: 0,
                        behavior: "smooth"
                    });
                else {
                    sliderRef.current.scrollTo({
                        left: sliderRef.current.getBoundingClientRect().width,
                        top: 0,
                        behavior: "smooth"
                    })
                }
            }
        }
    }
    setInterval(() => {
        slide(1);
    }, 20000);

    return (
        <div className="fs_horizontal_slider_wrapper">
            {props.title ?
                <SectionTitle title={props.title} />
                : null
            }
            <div className="fs_controller fs_controller--left" onClick={() => { slide(-1) }}><ChevronLeftIcon onClick={() => { slide(-1) }} /></div>
            <div className="fs_horizontal_slider" ref={sliderRef}>
                {
                    props.books.map((elem) => {
                        return (
                            <Book key={elem.id} qty={props.cartItems && props.cartItems[elem.book_id] ? props.cartItems[elem.book_id].stock : 0} max_stock={elem.max_stock} title={elem.title} language={elem.language} price={elem.price} discount={elem.discount} photo={elem.picture} weight={elem.weight} bookId={elem.book_id} delivery_factor={elem.delivery_factor} />
                        )
                    })
                }
            </div>
            <div className="fs_controller fs_controller--right" onClick={() => { slide(1) }}><ChevronRightIcon onClick={() => { slide(1) }} /></div>
        </div>
    )
}

export default HorizontalSlider;