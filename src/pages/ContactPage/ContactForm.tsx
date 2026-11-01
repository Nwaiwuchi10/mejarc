import React, { useState } from "react";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import Api from "@/src/Utils/Api";
import CustomModal from "@/src/components/Message/Message";
import { COMPANY_CONTACT_INFO } from "@/src/components/CompanyContact/CompanyContact";
type InfoIconProps = {
  icon: React.ReactNode;
  title?: string;
  text: string;
};
const InfoIcon = ({ icon, text }: InfoIconProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-yellow-400 p-2 rounded-full">{icon}</div>
      <div className="text-gray-700 font-medium">
        {text}
      </div>
    </div>
  );
};

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setModal({ type: "error", message: "Please fill out all required fields." });
      return;
    }

    setLoading(true);
    try {
      // 1. Submit to backend API
      await Api.post("/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "N/A",
        subject: "General Inquiry",
        message: formData.message,
      });

      setModal({
        type: "success",
        message: "Your message has been submitted and sent to email! Redirecting you to WhatsApp now..."
      });

      // 2. Format WhatsApp text
      const waText = `Hello, I would like to make an inquiry via the Mejarc contact form. Here are my details:\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone || "N/A"}\n*Message:* ${formData.message}`;
      const waUrl = `https://wa.me/${COMPANY_CONTACT_INFO.whatsapp2}?text=${encodeURIComponent(waText)}`;

      // 3. Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // 4. Open WhatsApp link
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1500);

    } catch (error: any) {
      setModal({
        type: "error",
        message: error.response?.data?.message || "Failed to submit message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-34 py-20">
      {modal && (
        <CustomModal
          type={modal.type}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Content */}
        <div className="text-white">
          <h2 className="text-3xl font-bold mb-4 text-black">Contact Us</h2>

          <p className="text-gray-700 max-w-md mb-8">
            We are committed to processing the information in order to contact
            you and talk about your project.
          </p>

          <div className="space-y-4">
            <InfoIcon
              icon={<Mail size={20} />}
              text="mejehaarc@gmail.com"
            />
            <InfoIcon icon={<Phone size={20} />} text="+234 911 253 0958" />
            <InfoIcon
              icon={<MapPin size={20} />}
              text="Shapati Ibeju Lekki Lagos Nigeria"
            />
          </div>
        </div>

        {/* Right Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-4">
          <div className="relative w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Full Name *"
              className="w-full text-gray-600 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div className="relative w-full">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Email Address *"
              className="w-full text-gray-600 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone number (optional)"
            className="w-full text-gray-600 border border-gray-200 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={5}
            placeholder="Send Message *"
            className="w-full text-gray-600 border border-gray-200 rounded-md px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-gray-200 bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-500 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
export default ContactFormSection;
