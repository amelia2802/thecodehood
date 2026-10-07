import { GiTechnoHeart } from "react-icons/gi";
import Search from "../utilities/Search.jsx"
import SignUp from "../utilities/SignUp.jsx"
export default function Header(){
    return(
        <header className="flex items-center justify-between text-lg">
            <section className="flex items-center gap-3">
                <GiTechnoHeart />
                <h1>theCodehood.</h1>
            </section>
            <Search />
            <SignUp />
        </header>
    )
}