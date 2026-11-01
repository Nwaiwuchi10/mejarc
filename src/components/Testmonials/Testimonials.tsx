import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import avatar from "../../assests/images/Ellipse2.png";
import avatar1 from "../../assests/images/PASSPORT.jpeg";
import avatar4 from "../../assests/images/kb.png";
import line from "../../assests/images/Line1.png";

type Testimonial = {
  image: StaticImageData;
  // namePerson: string;
  text: string;
  dark?: boolean;
};

const testimonials: Testimonial[] = [
  {
    image: avatar,
    // namePerson: "Grace Johnson",
    text: "The process was so smooth. From browsing plans to connecting with the right architect, everything felt easy. Today, I’m living in the home I’ve always dreamed of.",
    dark: true,
  },
  {
    image: avatar1,
    // namePerson: "Grace Johnson",
    text: "What I love most is the attention to detail. They truly listened to my ideas and helped me design a space that feels uniquely mine.",
    dark: true,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[whitesmoke] py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Left Content */}
        <div>
          <p className="flex items-center gap-2 text-sm text-gray-500">
            <Image src={line} alt="line" className="w-6 h-auto" />
            <span className="uppercase tracking-widest text-sm text-gray-500 font-semibold">
              REVIEWS
            </span>
          </p>

          <h2 className="text-3xl mb-6 md:text-4xl font-bold text-gray-900 leading-snug">
            What Our Homeowners Say
          </h2>
          <p className="text-gray-600 max-w-md text-sm leading-relaxed">
            Over the years, we’ve helped thousands of people bring their dream
            homes to life. Here’s what a few of them have to say about their
            experience working with us.
          </p>

          <Link
            href="/chooseAccountType"
            className="mt-8 bg-[#FFC107] text-black font-light px-6 py-3 rounded-md hover:bg-yellow-400 transition inline-block text-center"
          >
            Get Started
          </Link>
        </div>

        {/* Testimonials */}
        <div className="space-y-6 ">
          {/* Top Dark Card */}
          <TestimonialCard {...testimonials[0]} />

          {/* Highlighted Card */}
          <div className="relative bg-white rounded-xl p-6 border border-gray-200 shadow-md lg:-ml-20">
            <span className="absolute left-0 top-0 h-full w-1 bg-[#FFC107] rounded-l-xl" />

            <div className="flex gap-4 items-start ">
              <Image
                src={avatar4}
                alt="ola"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />

              <div>

                <h4 className="font-semibold text-gray-900">Ola Owoeye</h4>

                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  I never thought building a house could be this stress-free.
                  The expert guidance and variety of plans gave me the
                  confidence to start and I couldn’t be happier.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Dark Card */}
          <TestimonialCard {...testimonials[1]} />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  image,
  text,
  // namePerson,
  dark = false,
}: {
  image: StaticImageData;
  text: string;
  // namePerson: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 border ${dark
        ? "bg-whitesmoke text-gray-900 border-transparent shadow-md"
        : "bg-white text-gray-700 border-gray-200"
        }`}
    >

      <div className="flex gap-4 items-start">
        <Image
          src={image}
          alt="User"
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover shrink-0"
        />
        <div>


          {/* <h3 className="font-semibold text-gray-900">{namePerson}</h3> */}
          <p className="text-sm leading-relaxed">{text}</p>
        </div>

      </div>
    </div>
  );
}
