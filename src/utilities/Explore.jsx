export default function Explore({goToExplore}){
    return(
        <button 
            onClick={goToExplore}
            className="text-[#e3ddd7] bg-[#8b5b30] px-3 py-2 rounded-lg text-base"
        >
            Explore communities
        </button>
    )
}