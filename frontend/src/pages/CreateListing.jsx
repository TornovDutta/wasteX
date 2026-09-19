import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import axios from "axios";

export default function CreateListing() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("Describe your waste to auto-fill the form!");
  
  const [showModal, setShowModal] = useState(false);
  const [currentMissingIndex, setCurrentMissingIndex] = useState(0);
  const [modalAnswer, setModalAnswer] = useState("");
  const [missingFieldsList, setMissingFieldsList] = useState([]);

  const fieldQuestions = {
    title: "What is a good title for this listing?",
    material: "What material is this waste?",
    quantity: "What is the total quantity?",
    form: "What form is it in? (e.g., scraps, powder, liquid)",
    condition: "What is the condition? (e.g., dry, wet, mixed)",
    location: "Where is this located?",
    expected_price: "What is your expected price per kg (₹)?",
    frequency: "How often is this waste generated?"
  };

  const [formData, setFormData] = useState({
    title: "",
    material: "",
    form: "",
    condition: "",
    quantity: "",
    quantity_unit: "kg",
    frequency: "monthly",
    location: "",
    expected_price: "",
    category: "Other"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitListing = async (dataToSubmit) => {
    setLoading(true);
    try {
      const generatedTitle = dataToSubmit.title || `${dataToSubmit.quantity || ''} ${dataToSubmit.quantity_unit || 'kg'} ${dataToSubmit.condition || ''} ${dataToSubmit.material || ''} ${dataToSubmit.form || 'Waste'}`.trim().replace(/\s+/g, ' ');
      
      const payload = {
        ...dataToSubmit,
        title: generatedTitle,
        quantity: parseFloat(dataToSubmit.quantity),
        expected_price: parseFloat(dataToSubmit.expected_price),
        producer_id: "mock_producer_123"
      };
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/listings`, payload);
      navigate(`/listing/${res.data.id}`);
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handleModalNext = async (e) => {
    e.preventDefault();
    if (!modalAnswer.trim()) return;

    const currentField = missingFieldsList[currentMissingIndex];
    const updatedFormData = { ...formData, [currentField]: modalAnswer };
    setFormData(updatedFormData);
    setModalAnswer("");

    if (currentMissingIndex < missingFieldsList.length - 1) {
      setCurrentMissingIndex(currentMissingIndex + 1);
    } else {
      setShowModal(false);
      setAiMessage("All required fields collected! Auto-submitting the listing...");
      await submitListing(updatedFormData);
    }
  };
  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setAiLoading(true);
    setAiMessage("");
    try {
      const currentData = {};
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== "" && k !== "category" && k !== "quantity_unit") {
          currentData[k] = v;
        }
      });
        
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/parse-listing`, { 
        prompt: aiPrompt,
        current_data: currentData
      });
      
      const parsedData = res.data.parsed_data || {};
      const conversationalMessage = res.data.message || "Got it.";
      
      const newFormData = { ...formData };
      
      Object.keys(parsedData).forEach(key => {
        if (parsedData[key] !== null && parsedData[key] !== undefined && parsedData[key] !== "") {
          newFormData[key] = String(parsedData[key]);
        }
      });
      
      setFormData(newFormData);
      
      const requiredFields = ['material', 'quantity', 'form', 'condition', 'location', 'expected_price'];
      const missingFields = requiredFields.filter(field => !newFormData[field] || newFormData[field] === "");
      
      if (missingFields.length > 0) {
        setMissingFieldsList(missingFields);
        setCurrentMissingIndex(0);
        setShowModal(true);
      } else {
        setAiMessage(conversationalMessage.includes("All set") ? conversationalMessage : "All required fields extracted! Auto-submitting the listing...");
        await submitListing(newFormData);
      }
      setAiPrompt("");
    } catch (error) {
      console.error("AI parsing error:", error);
      setAiMessage("Sorry, I had trouble understanding that. Please try again or fill the form manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitListing(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-secondary border border-gray-700 p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-accent">Missing Information</h3>
            <p className="mb-4 text-textmuted text-lg">
              {fieldQuestions[missingFieldsList[currentMissingIndex]]}
            </p>
            <form onSubmit={handleModalNext}>
              <input 
                type="text" 
                value={modalAnswer} 
                onChange={(e) => setModalAnswer(e.target.value)} 
                className="w-full bg-primary border border-gray-700 rounded p-3 focus:border-accent focus:outline-none mb-6 text-white"
                autoFocus
                required
                placeholder="Type your answer here..."
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded text-textmuted hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-accent text-primary font-bold py-2 px-6 rounded hover:bg-orange-500 transition-colors">
                  {currentMissingIndex < missingFieldsList.length - 1 ? "Next" : "Finish & List"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">List Industrial Waste</h1>
      
      {/* AI Auto-fill Section */}
      <div className="bg-secondary p-4 rounded-lg border border-accent mb-6">
        <h2 className="text-xl font-semibold mb-2 text-accent">AI Auto-Fill</h2>
        <p className="text-sm text-textmuted mb-4">{aiMessage}</p>
        <form onSubmit={handleAiSubmit} className="flex gap-2">
          <input 
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="E.g. I have 500kg of dry cotton fabric scraps in Mumbai for ₹8/kg..."
            className="flex-1 bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none"
          />
          <button 
            type="submit"
            disabled={aiLoading}
            className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:bg-orange-500 transition-colors disabled:opacity-70"
          >
            {aiLoading ? "Thinking..." : "Extract"}
          </button>
        </form>
      </div>

      <form onSubmit={handleSubmit} className="bg-secondary p-6 rounded-lg border border-gray-800 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Waste Name (Optional)</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. Cotton Fabric Scraps" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Material</label>
            <input required name="material" value={formData.material} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. Cotton" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Quantity</label>
            <input required type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. 2000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Frequency</label>
            <select name="frequency" value={formData.frequency} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none">
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="one-time">One-time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Form</label>
            <input required name="form" value={formData.form} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. Fabric Scraps, Liquid, Powder" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Condition</label>
            <input required name="condition" value={formData.condition} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. Dry, Mixed, Pure" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Location</label>
            <input required name="location" value={formData.location} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. Indore, Madhya Pradesh" />
          </div>
          <div>
            <label className="block text-sm font-medium text-textmuted mb-1">Expected Price (₹/kg)</label>
            <input required type="number" name="expected_price" value={formData.expected_price} onChange={handleChange} className="w-full bg-primary border border-gray-700 rounded p-2 focus:border-accent focus:outline-none" placeholder="e.g. 8" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-6 bg-accent text-primary font-bold py-3 rounded-md hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? "Analyzing & Listing..." : <><Plus className="w-5 h-5" /> Analyze & List Waste</>}
        </button>

      </form>
    </div>
  );
}
