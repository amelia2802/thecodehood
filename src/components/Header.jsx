import { GiTechnoHeart } from "react-icons/gi";
import Search from "../utilities/Search.jsx"
import Explore from "../utilities/Explore.jsx"
export default function Header({ onExploreClick }){
    return(
        <header className="flex z-10 items-center px-6 py-3 justify-between text-lg">
            <section className="flex items-center gap-2">
                <GiTechnoHeart className="text-[#5A321A] text-lg"/>
                <h1>theCodehood.</h1>
            </section>
            <Search />
            <Explore onClick={onExploreClick}/>
        </header>
    )
}