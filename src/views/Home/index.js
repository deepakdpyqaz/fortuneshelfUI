import React from "react";
import Banner from "../../components/Banner";
import SectionTitle from "../../components/SectionTitle";
import {BookContainer} from "../../components/ViewBook";
const Home = ()=>{
    return(
        <>
          <Banner/>
          <SectionTitle title="Top Selling Books"/>
          <BookContainer/>
        </>
      
    )
}
export default Home;