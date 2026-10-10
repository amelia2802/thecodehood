import { GiTechnoHeart } from "react-icons/gi";
import Explore from "../utilities/Explore";
import SubmitForm from "../utilities/SubmitForm.jsx";

export default function Hero({ onExploreClick }) {
    return (
        <main className="flex px-6 py-3 items-center gap-6 bg-linear-to-b from-[#e3ddd7] via-[#d2b8a0] to-[#8b5b30]">
            <img className="w-3/5 rounded-xl" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="hero" />
            <div className="flex flex-col text-xl gap-6">
                <div className="flex items-center gap-2 text-2xl">
                    <GiTechnoHeart className="text-2xl text-[#5A321A]" />
                    <h1>theCodehood.</h1>
                </div>
                <p className="italic text-[#402e32]">Finding your little corner of the tech community locally</p>
                <div className="relative isolate mt-10 flex gap-6 text-[#e3ddd7] m-auto overflow-hidden rounded-md bg-linear-to-l from-[#f5d4b2] to-[#ab5709] px-4 py-2 shadow-md">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-[url(/images/doodle.png)] bg-cover bg-center opacity-40"
                    />
                    <p>Find your neighborhood tech community</p>
                    <Explore onClick={onExploreClick} />
                    <SubmitForm />
                </div>
            </div>
        </main>
    )
}