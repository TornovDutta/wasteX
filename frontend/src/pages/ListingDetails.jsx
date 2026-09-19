import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, MapPin, Truck, TrendingUp, CheckCircle2, ExternalLink } from "lucide-react";
import axios from "axios";

export default function ListingDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactModal, setContactModal] = useState({ show: false, buyerName: "" });
  const [message, setMessage] = useState("");
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/match/${id}`);
      setData(res.data);
    } catch (error) {
      console.error("Error fetching match data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Search className="w-10 h-10 animate-spin text-accent" /></div>;
  if (!data) return <div className="text-center text-textmuted py-20">Failed to load match data.</div>;

  const { listing, internal_matches, external_leads, market_intelligence } = data;

  const handleConnectClick = (buyerName) => {
    if (sentRequests[buyerName]) return;
    setContactModal({ show: true, buyerName });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/messages", {
        listing_id: id,
        buyer_name: contactModal.buyerName,
        message: message
      });
      setSentRequests(prev => ({ ...prev, [contactModal.buyerName]: true }));
      setContactModal({ show: false, buyerName: "" });
      setMessage("");
      alert(`Message sent to ${contactModal.buyerName} successfully!`);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto relative">
      {/* Contact Modal */}
      {contactModal.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-secondary border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold mb-2 text-white">Contact {contactModal.buyerName}</h3>
            <p className="text-sm text-textmuted mb-4">Send a message to initiate the exchange process.</p>
            <form onSubmit={handleSendMessage}>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-primary border border-gray-700 rounded p-3 text-white focus:border-accent focus:outline-none min-h-[120px] mb-4"
                placeholder="Hi, I'm interested in discussing the waste exchange..."
                required
                autoFocus
              ></textarea>
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setContactModal({ show: false, buyerName: "" })} 
                  className="px-4 py-2 rounded text-textmuted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-500 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overview Section */}
      <div className="bg-secondary p-6 rounded-lg border border-gray-800 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">{listing.title}</h1>
          <p className="text-textmuted flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {listing.location}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-textmain">Category: {listing.category}</span>
            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-textmain">Material: {listing.material}</span>
            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-textmain">Condition: {listing.condition}</span>
            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-textmain">Form: {listing.form}</span>
          </div>
        </div>
        
        <div className="bg-primary p-4 rounded-lg border border-gray-700 min-w-[200px] text-center flex flex-col justify-center">
          <p className="text-sm text-textmuted mb-1">Expected / Quantity</p>
          <p className="text-xl font-bold text-accent">₹{listing.expected_price}/kg</p>
          <p className="text-textmain font-semibold">{listing.quantity} {listing.quantity_unit} / {listing.frequency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Matches */}
        <div className="lg:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
              <CheckCircle2 className="text-green-500" /> Internal Network Matches
            </h2>
            {internal_matches && internal_matches.length > 0 ? (
              <div className="space-y-4">
                {internal_matches.map((match, idx) => (
                  <div key={idx} className="bg-secondary p-5 rounded-lg border border-gray-800 hover:border-green-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{match.name}</h3>
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold border border-green-500/30">
                        {match.compatibility} Match
                      </span>
                    </div>
                    <p className="text-textmuted text-sm mb-4">Distance: {match.distance}</p>
                    
                    <button 
                      onClick={() => handleConnectClick(match.name)} 
                      disabled={sentRequests[match.name]}
                      className={`${sentRequests[match.name] ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-green-600 hover:bg-green-500 text-white'} px-4 py-2 rounded text-sm font-bold transition-colors`}
                    >
                      {sentRequests[match.name] ? 'Request Sent' : 'Connect with Buyer'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-textmuted">No exact internal matches found. Relying on external leads.</p>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
              <Search className="text-accent" /> External Buyer Discovery
            </h2>
            {external_leads && external_leads.length > 0 ? (
              <div className="space-y-4">
                {external_leads.map((lead, idx) => (
                  <div key={idx} className="bg-primary p-5 rounded-lg border border-gray-800 hover:border-accent transition-colors">
                    <h3 className="text-lg font-bold text-white mb-2">{lead.name}</h3>
                    <p className="text-textmuted text-sm mb-3 line-clamp-2">{lead.snippet}</p>
                    <a href={lead.link} target="_blank" rel="noopener noreferrer" className="text-accent flex items-center gap-1 text-sm font-medium hover:underline">
                      Visit Website <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-textmuted">No external leads found. Please check SerpAPI key or query.</p>
            )}
          </section>

        </div>

        {/* Right Col: Intelligence */}
        <div className="space-y-6">
          <div className="bg-secondary p-5 rounded-lg border border-gray-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <TrendingUp className="text-accent" /> Market Intelligence
            </h3>
            <p className="text-sm text-textmuted mb-2">Observed market range for {listing.material}:</p>
            <p className="text-2xl font-bold text-accent mb-4">{market_intelligence?.estimated_price || "N/A"}</p>
            
            {listing.expected_price && market_intelligence?.estimated_price && (
              <p className="text-xs text-textmuted bg-primary p-2 rounded">
                Your expected price (₹{listing.expected_price}) is being compared with web sources.
              </p>
            )}
          </div>

          <div className="bg-secondary p-5 rounded-lg border border-gray-800">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
              <Truck className="text-accent" /> Logistics Estimate
            </h3>
            <div className="space-y-3 text-sm text-textmuted">
              <div className="flex justify-between">
                <span>Material Value:</span>
                <span className="text-white font-medium">₹{listing.quantity * listing.expected_price}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span>Est. Transport (Avg 100km):</span>
                <span className="text-red-400 font-medium">- ₹3,000</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-white font-bold">Est. Net Value:</span>
                <span className="text-green-500 font-bold">
                  ₹{(listing.quantity * listing.expected_price) - 3000}
                </span>
              </div>
              <p className="text-xs mt-2 italic text-gray-500">*Values are estimates only.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
