import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalogue from './components/Catalogue';
import Footer from './components/Footer';
import { getApprovedCommunities } from './utilities/communityService';

import './App.css';

function App() {
  const targetRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('All');
  const [geoStatus, setGeoStatus] = useState(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  // Database operations state (Loading, Error, Data)
  const [communities, setCommunities] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  const fetchCommunities = useCallback(() => {
    setDbLoading(true);
    setDbError(null);

    getApprovedCommunities()
      .then((result) => {
        if (result.error) {
          setDbError(result.error);
        }
        setCommunities(result.data || []);
      })
      .catch((err) => {
        setDbError(err.message || 'Error loading communities');
      })
      .finally(() => {
        setDbLoading(false);
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    getApprovedCommunities()
      .then((result) => {
        if (!ignore) {
          if (result.error) {
            setDbError(result.error);
          }
          setCommunities(result.data || []);
          setDbLoading(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setDbError(err.message || 'Error loading communities');
          setDbLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const scrollToCommunities = () => {
    targetRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleSearchSubmit = (val) => {
    if (typeof val === 'string') {
      setSearchQuery(val);
    }
    scrollToCommunities();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleAddSubmission = (submission) => {
    // Keep submission pending; do not add directly to approved communities
    setSubmissions((prev) => [submission, ...prev]);
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus({
        message: 'Browser geolocation is not supported on this device. You can search manually by city or postal code.',
        type: 'info'
      });
      return;
    }

    setIsGeoLoading(true);
    setGeoStatus(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsGeoLoading(false);
        const { latitude, longitude } = pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then((res) => res.json())
          .then((geoData) => {
            const locName =
              geoData.address?.city ||
              geoData.address?.town ||
              geoData.address?.village ||
              geoData.address?.state ||
              '';
            if (locName) {
              setSearchQuery(locName);
              setGeoStatus({
                message: `Located: ${locName}`,
                type: 'success'
              });
              scrollToCommunities();
            } else {
              setGeoStatus({
                message: 'Location detected. You can type your city or postal code to search.',
                type: 'info'
              });
            }
          })
          .catch(() => {
            setGeoStatus({
              message: 'Location detected. You can type your city or postal code to search.',
              type: 'info'
            });
          });
      },
      (err) => {
        setIsGeoLoading(false);
        let msg = 'Location access was denied or unavailable. The directory remains fully usable by searching manually.';
        if (err.code === 1) { // PERMISSION_DENIED
          msg = 'Location permission was denied. You can search by city, state, or postal code.';
        }
        setGeoStatus({
          message: msg,
          type: 'info'
        });
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6f0] text-[#402e32] gap-10 font-sans">
      <Header
        onExploreClick={scrollToCommunities}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
        onLocationClick={handleGeolocation}
        isGeoLoading={isGeoLoading}
        onSubmitSuccess={handleAddSubmission}
      />
      <Hero
        onExploreClick={scrollToCommunities}
        onSubmitSuccess={handleAddSubmission}
      />
      <Catalogue
        refProp={targetRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTech={selectedTech}
        setSelectedTech={setSelectedTech}
        onClearSearch={handleClearSearch}
        onLocationClick={handleGeolocation}
        isGeoLoading={isGeoLoading}
        geoStatus={geoStatus}
        setGeoStatus={setGeoStatus}
        onSubmitSuccess={handleAddSubmission}
        submissions={submissions}
        communities={communities}
        dbLoading={dbLoading}
        dbError={dbError}
        onRetry={fetchCommunities}
      />
      <Footer />
    </div>
  );
}

export default App;
