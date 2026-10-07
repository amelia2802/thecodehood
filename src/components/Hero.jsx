import { GiTechnoHeart } from "react-icons/gi";
import SignUp from "../utilities/SignUp";
export default function hero(){
    return(
        <main className="flex items-center gap-6">
            <img className="w-3/5 rounded-xl" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="hero" />
            <div className="flex flex-col text-xl gap-6">
                <div className="flex items-center gap-3 text-2xl">
                    <GiTechnoHeart />
                    <h1>theCodehood.</h1>
                </div>
                <p>finding your little corner of the tech community locally</p>
                <div className="w-3/4 flex gap-6 m-auto">
			        <p>Find your neighborhood tech community</p>
                    <SignUp />
                </div>
            </div>
        </main>
    )
}