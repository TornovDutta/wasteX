import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function NearbyBuyers() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);
  const [userLocation, setUserLocation] = useState("");
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        fetchNearbyBuyers();
      }
    }
  }, [user, loading, navigate]);

  const fetchNearbyBuyers = async () => {
    try {
      setFetching(true);
      // Wait for user.dbId to be available, or we might need to look it up by firebase_uid
      // But useAuth sets dbId if logged in via google or signup. 
      // If it's missing, let's gracefully handle it.
      if (!user?.dbId) {
          setError("User profile not fully loaded yet. Please try again.");
          setFetching(false);
          return;
      }
      
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/nearby-buyers/${user.dbId}`);
      setBuyers(res.data.buyers);
      setUserLocation(res.data.user_location);
      setError(null);
    } catch (err) {
      console.error("Error fetching nearby buyers:", err);
      setError("Failed to load nearby buyers.");
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-xl text-gray-600">Loading nearby buyers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Nearby Buyers</h1>
      <p className="text-gray-600 mb-8">
        Buyers near your location: {userLocation || "Unknown"}
      </p>

      {buyers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
          No buyers found near your location.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{buyer.name}</h3>
              <div className="text-gray-600 text-sm mb-4">
                <span className="flex items-center gap-1 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  {buyer.location}
                </span>
                <span className="flex items-center gap-1 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  Distance: {buyer.distance}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Compatibility: {buyer.compatibility}
                </span>
              </div>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Contact Buyer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
