"use client";

import { useState } from "react";
import { ChevronDown, ChevronUpIcon } from "lucide-react";

const faqs = [
  {
    question: "What is the Mejarc Design Ecosystem?",
    answer:
      "It’s an all-in-one platform for custom design projects, pre-made plans, and professional add-on services, connecting clients with trusted vendors.",
  },
  {
    question: "How do I start a custom design project?",
    answer:
      "You can start by selecting a custom design option, filling in your requirements, and submitting your request. Our team will guide you through the process.",
  },
  {
    question: "Can I buy ready-made plans instead of custom designs?",
    answer:
      "Yes, Mejarc offers a variety of ready-made plans that you can purchase instantly without starting a custom project.",
  },
  {
    question: "What are Add-On Services, and how do they work?",
    answer:
      "Add-On Services are optional professional services such as consultations, revisions, and project supervision that enhance your design experience.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-whitesmoke py-16 sm:py-20 md:py-24 lg:py-32 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            {/* Section Heading (NOT inside card) */}
            <h2
              className="text-2xl font-semibold text-gray-900 font-oxygen
               mb-12 sm:mb-16 md:mb-16 lg:mb-24"
            >
              Frequently Asked Questions
            </h2>

            {/* Left Card */}
            <div className="bg-whitesmoke p-8 border border-gray-300 rounded-lg p-4 md:p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  How do I start a custom design project?
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  If you cannot find the answer to your question, send us an
                  email and we will get back to you as soon as possible.
                </p>
              </div>

              <button className="mt-6 w-fit bg-yellow-400 hover:bg-yellow-500 transition-colors text-black font-medium px-4 py-2 rounded-md text-sm">
                Send email
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN – FAQ ACCORDION */}
          <div className="space-y-4 p-0 lg:p-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-whitesmoke border border-gray-300 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {faq.question}
                  </span>

                  {/* Icon Wrapper */}
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-yellow-400 bg-yellow-400">
                    {activeIndex === index ? (
                      <ChevronUpIcon className="h-4 w-4 text-black" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-black" />
                    )}
                  </span>
                </button>

                <div
                  className={`px-4 overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? "max-h-28 pb-3" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
