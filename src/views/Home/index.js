import React,{useState,useEffect} from "react";
import Banner from "../../components/Banner";
import SectionTitle from "../../components/SectionTitle";
import {BookContainer} from "../../components/ViewBook";
import axios from "axios";
import { TextContainer } from "../../components/Utilities";
const Home = ()=>{
    const [books,setBooks] = useState([]);
    useEffect(()=>{
      axios.get("top_selling").then((res)=>{
        setBooks(res.data);
      }).catch(err=>{
        alert(err.message);
      })
    },[])
    return(
        <>
          <Banner/>
          <SectionTitle title="About Us"/>
          <TextContainer>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis quis soluta hic doloremque enim dicta mollitia eligendi pariatur? Totam quisquam quia enim quaerat rem corporis dolore deleniti voluptas neque, minima iure aperiam illum facilis aliquid dolorum. Possimus quasi iste id doloremque ratione assumenda vitae explicabo, optio repellat, rerum aspernatur incidunt dignissimos officia, earum cum aliquid quae ipsam quis asperiores voluptatem. Eaque cum quisquam consectetur deserunt necessitatibus explicabo tempora, quas omnis dolor porro repellat maxime nostrum odit libero, fugiat maiores unde. Nostrum obcaecati in repellat quaerat aliquid illo quidem, quam nisi architecto maxime dignissimos voluptate cupiditate, quis praesentium aspernatur amet delectus! Natus provident dolores illo corrupti incidunt veniam, nulla minima culpa rerum. Totam corporis ratione temporibus possimus eveniet dolorem magni. Quam deserunt quo dolor? Eos veritatis beatae dolore inventore autem recusandae reprehenderit dignissimos. Quas accusantium a corrupti ratione? Quisquam molestiae laborum earum, cum laudantium odit delectus ratione ipsum quaerat quod minus incidunt, architecto placeat saepe fugit eum sequi totam iusto ipsa. Ad excepturi dignissimos vero voluptatem atque quibusdam dicta nihil recusandae modi esse expedita repellat nostrum optio ab omnis vitae, officia repudiandae voluptate ratione quisquam aspernatur delectus architecto incidunt illo. Eum accusantium inventore corporis harum sunt blanditiis molestias consequatur impedit maiores aliquam ipsum, quaerat hic laboriosam dolores veniam suscipit aspernatur. Velit perspiciatis dignissimos itaque nobis atque eum impedit ratione dicta voluptatem, quo optio ea doloremque! Quod quam dolorum amet, nobis ratione nihil deserunt, consequatur esse animi nostrum tenetur omnis corrupti porro, et excepturi iure impedit illo vero quaerat? Dignissimos, quo dolor.
          </TextContainer>
          <SectionTitle title="Top Selling Books"/>

          <BookContainer books={books}/>
        </>
      
    )
}
export default Home;