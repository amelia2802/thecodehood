import { IoSearchCircleOutline } from "react-icons/io5";
export default function Search(){
    return(
        <div>
            <input type="text" placeholder="City, State, Zip" />
            <button><IoSearchCircleOutline /></button>
        </div>
    )
}