"use client";
import Image from "next/image";
import img1 from "../../assests/images/suggestion 1.png";
import img2 from "../../assests/images/settings-window (1) 1.png";
import img3 from "../../assests/images/heart-partner-handshake 1.png";
const ContactCards = () => {
  const cards = [
    {
      title: "General Inquiries",
      text: "For questions about our services and platform.",
      icon: (
        <Image src={img1} alt="contact icons" className="w-6 h-6 text-black" />
      ),
    },
    {
      title: "Technical Support",
      text: "Facing issues? Our support team is here to help.",
      icon: (
        <Image src={img2} alt="contact icons" className="w-6 h-6 text-black" />
      ),
    },
    {
      title: "Vendor/Partnerships",
      text: "Interested in joining as a vendor or partner?",
      icon: (
        <Image src={img3} alt="contact icons" className="w-6 h-6 text-black" />
      ),
      link: "Apply Now",
    },
  ];

  return (
    <section className="w-full px-4 sm:px-6 lg:px-34 py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 mb-4">
              {card.icon}
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              {card.title}
            </h3>

            <div className="text-sm text-gray-600 mt-2 leading-relaxed break-words whitespace-normal">
              <p className="text-sm text-gray-600 mt-2 whitespace-normal break-words lg:line-clamp-2">
                {card.text}
              </p>
              {card.link && (
                <span className="text-blue-600 font-medium underline inline">
                  {card.link}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default ContactCards;
