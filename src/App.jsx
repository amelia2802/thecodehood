import {useRef} from "react";
import Header from './components/Header';
import Hero from './components/Hero';
//import CommunityMatchmaker from './components/CommunityMatchmaker';
import Catalogue from './components/Catalogue';
import Footer from './components/Footer';


import './App.css';

function App(){ 
  const communityRef = useRef(null);

  const handleScrollToExplore = ()=>{
    communityRef.current?.scrollIntoView({behavior: "smooth"})
  }

  return (
    <div className="flex flex-col min-h-screen gap-10 px-4 py-3.5">
      <Header onClick={handleScrollToExplore}/>
      <Hero onClick={handleScrollToExplore}/>
      <Catalogue ref={communityRef}/>
      <Footer />
    </div>
  );
}

export default App;
