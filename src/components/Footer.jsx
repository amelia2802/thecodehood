import { GiTechnoHeart } from "react-icons/gi";
import {FaGithub , FaReact,FaPenNib } from "react-icons/fa";
export default function Footer(){
    return(
        <footer>
          <div className="flex flex-col gap-3 md:flex-row items-center justify-between px-6 py-3 text-base">
            <button
              type="button"
              className="flex shrink-0 cursor-pointer items-center gap-2"
              aria-label="Explore theCodehood communities"
            >
              <GiTechnoHeart className="text-base text-[#5A321A]" />
              <span className="text-base font-bold tracking-tight text-[#402e32] md:text-2xl">
                  theCodehood<span className="text-[#8b5b30]">.</span>
              </span>
            </button>
            <div className="flex gap-2">
              <p className="text-center"><a className="text-2xl text-[#8b5b30] underline" href="https://github.com/amelia2802/thecodehood"><FaGithub /></a></p>
              <p className="text-center"><a className="text-2xl text-[#8b5b30] underline" href="https://dev.to/amelia2802/thecodehood-helping-developers-get-out-from-behind-the-screen-22jj"><FaPenNib /></a></p>
            </div>
          </div>
				  <p className="text-center italic">&copy; All Rights Reserved. Built with <FaReact className="inline"/> by Amelia Dutta.</p>
        </footer>
    )
}