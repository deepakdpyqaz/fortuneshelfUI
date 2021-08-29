import React, { useState, useEffect } from "react";
import Banner from "../../components/Banner";
import SectionTitle from "../../components/SectionTitle";
import { BookContainer } from "../../components/ViewBook";
import axios from "axios";
import { TextContainer } from "../../components/Utilities";
import { useAlert } from "react-alert";
import Slide from 'react-reveal/Slide';

const Home = () => {
  const [books, setBooks] = useState([]);
  const alert = useAlert();
  useEffect(() => {
    axios.get("top_selling").then((res) => {
      setBooks(res.data);
    }).catch(err => {
      alert.error(err.message);
    })
  }, [])
  return (
    <>
      <Banner />
      <Slide right>
        <SectionTitle title="About Us" />
        <TextContainer textCenter={true}>
          Every country has something unique to offer to the whole world. What does India has?
          It is the Knowledge of Spirituality which India can offer to the whole world to become a true Vishva Guru and lead the world towards the highest goal of humanity.

          Fortune Shelf is a small contribution towards this bigger cause by delivering amazing spiritual enlightening books to every house across every corner of India. To every villages and towns.
          If you wish to help our cause kindly support by donating any amount as per below details :
        </TextContainer>
        <SectionTitle title="Top Selling Books" />
      </Slide>
      <Slide left>
        <BookContainer books={books} />
      </Slide>
    </>

  )
}
export default Home;