import { GiTechnoHeart } from "react-icons/gi";
import BentoGrid from "../utilities/BentoGrid";
import Explore from "../utilities/Explore";
import SubmitForm from "../utilities/SubmitForm";

export default function Hero(){
    return(
        <main className="w-full py-6">
            <div className="flex flex-col md:gap-8 md:flex-row">
                <BentoGrid />
                <section className="flex flex-col gap-4 mt-40 items-center">
                    <div className="flex items-center gap-2 text-4xl font-bold">
                        <GiTechnoHeart className="text-[#402e32]"/>
                        <h2>theCodehood<span className="text-[#8b5b30]">.</span></h2>
                    </div>
                    <p className="text-lg">Find your people, beyond the pixels</p>
                    <div className="flex justify-center gap-6 items-center">
                        <Explore />
                        <SubmitForm />
                    </div>
                </section>
            </div>
        </main>
    )
}