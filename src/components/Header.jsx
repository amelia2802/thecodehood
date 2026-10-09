import { GiTechnoHeart } from "react-icons/gi";
import Search from "../utilities/Search.jsx"
import SignUp from "../utilities/SignUp.jsx"
export default function Header(){
    return(
        <header className="flex z-10 items-center px-6 py-3 justify-between text-lg">
            <section className="flex items-center gap-2">
                <GiTechnoHeart className="text-[#5A321A] text-lg"/>
                <h1>theCodehood.</h1>
            </section>
            <Search />
            <SignUp />
        </header>
    )
}