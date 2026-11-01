import { Search } from "lucide-react";
import buyplanimg from "../../assests/images/planshero.png";
import { useState } from "react";

interface BuyPlansHeroSectionProps {
  onSearch?: (term: string) => void;
}

export default function BuyPlansHeroSection({ onSearch }: BuyPlansHeroSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <main className="w-full  bg-[whitesmoke] py-6">
      {/* Hero Wrapper */}
      <section
        className="relative mx-auto flex min-h-screen w-[97%] items-center justify-center rounded-3xl
         bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(${buyplanimg.src})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Breadcrumb (Top Left) */}
        <div className="absolute left-14 top-16 z-10">
          <p className="text-sm text-white/80">
            Home <span className="mx-1">/</span> Buy Plans
          </p>
        </div>

        {/* Centered Content */}
        <div className="relative z-10 flex w-full flex-col items-center px-4 text-center sm:px-8 lg:px-20">
          {/* Heading */}
          <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Find the perfect plan
            <br className="hidden sm:block" />
            for your project
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-center max-w-2xl text-sm text-white/80 sm:text-base">
            Discover the perfect plan tailored to bring your project vision to
            life with ease and precision
          </p>

          {/* Search Box */}
          <div className="mt-10 w-full max-w-3xl">
            <div className="flex items-center overflow-hidden rounded-xl bg-white shadow-xl">
              <div className="flex items-center px-4 text-gray-400">
                <Search size={20} />
              </div>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
                placeholder="Search plans (e.g. 3-bedroom duplex, kitchen design)"
                className="flex-1 px-2 py-4 text-sm outline-none sm:text-base text-black"
              />

              <button
                onClick={handleSearchSubmit}
                className="m-2 rounded-lg bg-yellow-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500 sm:text-base"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
