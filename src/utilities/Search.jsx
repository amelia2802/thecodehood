import { IoSearchCircleOutline } from "react-icons/io5";
export default function Search(){
    return(
        <div className="relative">
            <input type="text" placeholder="City, State, Zip" className="border border-[#5A321A] rounded-md py-1 pl-3 pr-10" />
            <button type="button" aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-[#5A321A] p-1 text-[#e3ddd7]">
                <IoSearchCircleOutline className="text-2xl" />
            </button>
        </div>
    )
}