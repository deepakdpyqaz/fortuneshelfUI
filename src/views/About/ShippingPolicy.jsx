import SectionTitle from "../../components/SectionTitle";
import { TextContainer } from "../../components/Utilities";
const ShippingPolicy = () => {
    return (
        <>
            <SectionTitle title="Shipping Policies" />
            <TextContainer>
                <ol>
                    <li>Once we received the order, it will be shipped within 5-7 working days.</li>
                    <li>Tracking details will be mailed to your registered email address once the order is dispatched from our warehouse.</li>
                    <li>Once the order is shipped, It may reach to you in 7-12&nbsp; working days in metro cities and rest other areas it may take upto 30 days.</li>
                </ol>
            </TextContainer>

        </>
    )
}

export default ShippingPolicy;