import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, RefreshCw, Box, Recycle, Leaf } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings`);
      setListings(res.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!searchQuery.trim()) {
      fetchListings();
      return;
    }

    try {
      let semanticListings = [];
      try {
        const resSemantic = await axios.post(`${import.meta.env.VITE_API_URL}/search/semantic`, { query: searchQuery });
        semanticListings = resSemantic.data;
      } catch (err) {
        console.warn("Semantic search failed", err);
      }

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/listings`);
      const allListings = res.data;
      const q = searchQuery.toLowerCase();
      const fuzzyListings = allListings.filter(l => 
        (l.title && l.title.toLowerCase().includes(q)) || 
        (l.material && l.material.toLowerCase().includes(q)) ||
        (l.category && l.category.toLowerCase().includes(q)) ||
        (l.location && l.location.toLowerCase().includes(q))
      );

      const mergedMap = new Map();
      semanticListings.forEach(l => mergedMap.set(l._id, l));
      fuzzyListings.forEach(l => mergedMap.set(l._id, l));

      setListings(Array.from(mergedMap.values()));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary text-textmain min-h-screen font-sans">
      <main className="relative">
        <section className="relative border-b border-gray-800">
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(245,158,11,0.15)_9%,transparent)]"></div>
          <div className="box-border mx-auto w-[1300px] max-w-full px-5 lg:px-16 border-x border-gray-800 border-dashed relative pb-12 pt-7 md:pb-16 md:pt-10">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
              <div className="relative z-10 animate-fade-in">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-textmuted">
                  <span className="inline-flex items-center gap-2 rounded-md border border-gray-800 bg-secondary/50 py-1 pl-2.5 pr-1 font-medium text-textmain/80">
                    India's largest B2B waste network
                    <span className="rounded-[5px] border border-accent/35 bg-accent/10 px-2 py-0.5 font-semibold text-accent">for industries</span>
                  </span>
                </div>
                
                <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-[110%] tracking-tight sm:text-6xl md:text-[64px] md:leading-[106%] lg:max-w-none lg:text-5xl xl:text-[64px]">
                  <span className="relative inline-block">
                    Industrial
                    <span aria-hidden="true" className="absolute inset-x-[0.02em] -bottom-[0.08em] h-[0.15em] bg-[linear-gradient(180deg,#F59E0B_33.4%,#FDE68A_33.4%_66.7%,#10B981_66.7%)]"></span>
                  </span>{" "}
                  Circularity
                </h1>
                
                <div className="mt-6 max-w-xl">
                  <div className="flex items-center gap-4">
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-textmuted">Connecting buyers and sellers</span>
                    <span aria-hidden="true" className="h-px min-w-0 flex-1 bg-gray-800"></span>
                  </div>
                </div>
                
                <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-textmain/80">
                  A marketplace for industrial byproducts, run with the people who build a sustainable future. 
                  Turn your disposal costs into new revenue streams by connecting with local buyers and recyclers.
                </p>
                
                <dl className="mt-8 max-w-xl grid divide-y divide-gray-800 border-y border-gray-800 md:grid-cols-2 md:divide-x md:divide-y-0">
                  <div className="py-4 md:py-5 md:pr-6">
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-textmuted">
                      <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-accent/10 text-accent">
                        <Box className="w-3.5 h-3.5" />
                      </span>
                      Active Listings
                    </dt>
                    <dd>
                      <p className="mt-2.5 text-balance font-mono text-2xl font-semibold leading-[120%] tracking-tight text-accent">
                        {listings.length > 0 ? listings.length : '0'}
                      </p>
                      <p className="mt-2.5 text-pretty text-[13px] leading-[165%] text-textmain/80">Materials currently available on the platform.</p>
                    </dd>
                  </div>
                  <div className="py-4 md:py-5 md:pl-6">
                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-textmuted">
                      <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-md border border-green-500/35 bg-green-500/10 text-green-500">
                        <Recycle className="w-3.5 h-3.5" />
                      </span>
                      Waste Exchanged
                    </dt>
                    <dd>
                      <p className="mt-2.5 text-balance font-mono text-2xl font-semibold leading-[120%] tracking-tight text-green-500">
                        18.7 T
                      </p>
                      <p className="mt-2.5 text-pretty text-[13px] leading-[165%] text-textmain/80">Total industrial waste successfully repurposed.</p>
                    </dd>
                  </div>
                </dl>
                
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link to="/create" className="group relative inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-accent text-primary text-sm font-medium whitespace-nowrap transition-all outline-none hover:bg-orange-500 h-10 gap-1.5 px-[14px]">
                    <span className="relative z-10 inline-flex items-center gap-[inherit]">
                      <span>List your waste</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
              
              <div className="relative -mx-5 h-[350px] sm:h-[440px] lg:mx-0 lg:-mr-16 lg:h-[540px] xl:h-[580px] hidden md:block">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(to right, #4b5563 1px, transparent 1px), linear-gradient(to bottom, #4b5563 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="relative">
                     <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"></div>
                     <Leaf className="w-32 h-32 text-accent/80 relative z-10 animate-pulse" />
                  </div>
                  <p className="mt-8 font-mono text-[11px] tracking-[0.35em] text-textmuted">CIRCULAR ECONOMY</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="marketplace" className="border-b border-gray-800">
          <div className="box-border mx-auto w-[1300px] max-w-full px-5 lg:px-16 border-x border-gray-800 border-dashed py-14 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <div className="font-mono text-sm font-medium uppercase tracking-wider text-accent">01 / Marketplace</div>
              <h2 className="mt-3 text-balance text-4xl font-medium leading-[120%] tracking-tight md:text-5xl md:leading-[125%]">Recent Listings.</h2>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-textmuted">Explore the latest industrial materials available for exchange. Connect with sellers to negotiate and procure.</p>
            </div>
            <div className="mt-8 max-w-2xl mx-auto flex flex-col items-center">
              <form onSubmit={handleSearch} className="w-full flex items-center bg-secondary/80 border border-gray-700 rounded-full overflow-hidden focus-within:border-accent transition-colors">
                {/* Unified Search Input */}
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search listings..." 
                  className="w-full bg-transparent text-textmain px-4 py-3 outline-none placeholder:text-gray-500"
                />
                <button type="submit" className="bg-accent text-primary px-6 py-3 font-semibold hover:bg-orange-500 transition-colors">
                  Search
                </button>
              </form>
            </div>
            
            <div className="mt-12 md:mt-16 border-t border-gray-800 pt-12">
              {loading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-accent" />
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-secondary/40 border border-gray-800 rounded-xl p-8 text-center text-textmuted">
                  No active listings found. Be the first to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map(listing => (
                    <div key={listing._id} className="rounded-xl border border-gray-800 bg-secondary/40 p-5 hover:border-accent transition-colors group flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-textmuted border border-gray-800 px-2 py-1 rounded bg-secondary">
                          {listing.category || 'Uncategorized'}
                        </span>
                        <span className="font-mono text-lg font-semibold text-accent tracking-tight">
                          ₹{listing.expected_price}/kg
                        </span>
                      </div>
                      <h3 className="text-xl font-medium tracking-tight mb-3 flex-grow">{listing.title}</h3>
                      
                      <div className="border-t border-gray-800 pt-4 mt-auto">
                        <p className="text-[13px] leading-[165%] text-textmuted mb-4 line-clamp-2">
                          <strong className="text-textmain/80 font-medium">{listing.quantity} {listing.quantity_unit} / {listing.frequency}</strong><br/>
                          Location: {listing.location}
                        </p>
                        <Link to={`/listing/${listing._id}`} className="inline-flex items-center gap-1.5 text-accent text-sm font-medium underline-offset-4 transition-colors hover:underline group-hover:gap-2">
                          View details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="border-b border-gray-800">
          <div className="box-border mx-auto w-[1300px] max-w-full px-5 lg:px-16 border-x border-gray-800 border-dashed py-14 md:py-20">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <div className="font-mono text-sm font-medium uppercase tracking-wider text-green-500">02 / The Process</div>
              <h2 className="mt-3 text-balance text-4xl font-medium leading-[120%] tracking-tight md:text-5xl">How Circularity Works.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-gray-800 to-transparent opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative p-6 bg-primary border border-gray-800 rounded-lg hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center mb-6 text-textmuted font-mono font-bold text-xl border border-gray-700">01</div>
                  <h3 className="text-xl font-semibold mb-3">List your Byproducts</h3>
                  <p className="text-textmuted text-sm leading-relaxed">Producers catalog their industrial waste, scrap, or surplus materials with detailed specifications and quantities.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-accent to-transparent opacity-10 group-hover:opacity-30 transition duration-500 delay-100"></div>
                <div className="relative p-6 bg-primary border border-gray-800 rounded-lg hover:-translate-y-1 transition-transform duration-300 delay-100">
                  <div className="w-12 h-12 bg-accent/10 rounded flex items-center justify-center mb-6 text-accent font-mono font-bold text-xl border border-accent/20">02</div>
                  <h3 className="text-xl font-semibold mb-3">Get AI Matched</h3>
                  <p className="text-textmuted text-sm leading-relaxed">Our system automatically identifies local recyclers and consumers who need your exact material specifications.</p>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-b from-green-500 to-transparent opacity-10 group-hover:opacity-30 transition duration-500 delay-200"></div>
                <div className="relative p-6 bg-primary border border-gray-800 rounded-lg hover:-translate-y-1 transition-transform duration-300 delay-200">
                  <div className="w-12 h-12 bg-green-500/10 rounded flex items-center justify-center mb-6 text-green-500 font-mono font-bold text-xl border border-green-500/20">03</div>
                  <h3 className="text-xl font-semibold mb-3">Exchange & Report</h3>
                  <p className="text-textmuted text-sm leading-relaxed">Complete the transaction securely, divert waste from landfills, and download automated sustainability reports.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="border-b border-gray-800 bg-[radial-gradient(ellipse_80%_80%_at_50%_120%,rgba(16,185,129,0.05)_0%,transparent_100%)]">
          <div className="box-border mx-auto w-[1300px] max-w-full px-5 lg:px-16 border-x border-gray-800 border-dashed py-14 md:py-20">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div>
                <div className="font-mono text-sm font-medium uppercase tracking-wider text-accent mb-3">03 / Benefits</div>
                <h3 className="text-balance text-3xl font-medium leading-[130%] tracking-tight md:text-4xl">What you carry home.</h3>
              </div>
              <p className="text-pretty text-textmuted lg:max-w-sm lg:text-right">Value delivered at every step of the circular economy journey.</p>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-16 md:grid-cols-4">
              <div className="group flex flex-col items-center gap-4">
                <div className="flex w-full max-w-38 justify-center">
                  <div className="relative flex h-24 w-full select-none flex-col items-center justify-center gap-1 border-2 px-3 text-center transition-all duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105 rounded-xl border-gray-700 text-gray-500 group-hover:border-accent group-hover:text-accent group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em]">Zero Waste</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-60">Certification</span>
                  </div>
                </div>
                <p className="max-w-40 text-pretty text-center text-xs leading-snug text-textmuted">Official documentation for your ESG compliance.</p>
              </div>
              <div className="group flex flex-col items-center gap-4">
                <div className="flex w-full max-w-38 justify-center">
                  <div className="relative flex h-24 w-full select-none flex-col items-center justify-center gap-1 border-2 px-3 text-center transition-all duration-300 ease-out group-hover:rotate-6 group-hover:scale-105 rounded-full border-gray-700 text-gray-500 group-hover:border-green-500 group-hover:text-green-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em]">New Revenue</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-60">Streams</span>
                  </div>
                </div>
                <p className="max-w-40 text-pretty text-center text-xs leading-snug text-textmuted">Monetize byproducts instead of paying disposal fees.</p>
              </div>
              <div className="group flex flex-col items-center gap-4">
                <div className="flex w-full max-w-38 justify-center">
                  <div className="relative flex h-24 w-full select-none flex-col items-center justify-center gap-1 border-2 px-3 text-center transition-all duration-300 ease-out group-hover:-rotate-2 group-hover:scale-105 rounded-xl border-gray-700 text-gray-500 group-hover:border-blue-400 group-hover:text-blue-400 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em]">Network</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-60">Connections</span>
                  </div>
                </div>
                <p className="max-w-40 text-pretty text-center text-xs leading-snug text-textmuted">Connect with verified industrial partners locally.</p>
              </div>
              <div className="group flex flex-col items-center gap-4">
                <div className="flex w-full max-w-38 justify-center">
                  <div className="relative flex h-24 w-full select-none flex-col items-center justify-center gap-1 border-2 px-3 text-center transition-all duration-300 ease-out group-hover:rotate-2 group-hover:scale-105 rounded-[2rem] border-gray-700 text-gray-500 group-hover:border-purple-400 group-hover:text-purple-400 group-hover:shadow-[0_0_15px_rgba(192,132,252,0.2)]">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em]">Carbon Offset</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-60">Tracking</span>
                  </div>
                </div>
                <p className="max-w-40 text-pretty text-center text-xs leading-snug text-textmuted">Automatically calculate emissions saved.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
