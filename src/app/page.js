'use client';
import Hero from "./components/layout/hero";
import HomeMenu from "./components/layout/HomeMenu";
import SectionHeaders from "./components/layout/sectionheaders";
import HomeMenuWithAddOns from "./components/layout/HomeMenuWithAddOns";
import Image from "next/image";
export default function Home() {

  return (
    <>
      <Hero />
      <section id="menu">
        <HomeMenu />
        <HomeMenuWithAddOns />
      </section>
      <section id="about" className="py-16 bg-gray-50">
        <SectionHeaders 
          subHeader="Our Story"
          mainHeader="About Us"
        />
        
        <div className="max-w-6xl mx-auto mt-8 px-4">
          {/* Introduction */}
          <div className="text-lg flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <p className="text-gray-700 leading-relaxed mb-4">
                At Pasta Express, we believe that pasta is more than just a meal – it's a canvas for creativity.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our journey began with a simple question: Why settle for ordinary pasta when there's a world of flavors, shapes, and colors waiting to be explored?
              </p>
              <p className="text-gray-700 leading-relaxed">
                Driven by this idea, we set out to build a place where pasta lovers and culinary dreamers could come together to create something truly unique.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="w-[400px] h-[350px] relative">
                <Image
                  src="/pasta-making.jpg"
                  alt="Artisan pasta making"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className=" text-lg flex flex-col md:flex-row-reverse items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <p className="text-gray-700 leading-relaxed mb-4">
                From the start, our mission has been to empower our customers to bring their pasta fantasies to life.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Whether it's classic spaghetti with a twist, bold and vibrant tom yum sauce, or a brand-new fusion of flavors that's never been tasted before, Pasta Express is here to make it happen.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With our premium ingredients, artisan techniques, and a dash of passion, we provide everything you need to craft pasta that's as distinctive as you are.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="w-[400px] h-[350px] relative">
                <Image
                  src="/fresh-ingredients.jpg"
                  alt="fresh pasta ingredients"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="text-lg flex flex-col md:flex-row items-center gap-8 mb-16">
            <div className="md:w-1/2">
              <p className="text-gray-700 leading-relaxed mb-4">
                Our small team is made up of food artisans & pasta enthusiasts who believe in celebrating individuality.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                We're obsessed with quality and committed to sustainability, partnering with local farms to source fresh, organic ingredients.
              </p>
              <p className="text-gray-700 leading-relaxed">
                As we continue to grow, we remain dedicated to pushing the boundaries of what pasta can be – transforming your ideas into delicious reality, one customized pasta at a time.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="w-[400px] h-[350px] relative">
                <Image
                  src="/pasta-team.jpg"
                  alt="Our team"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>


          {/* Call to Action */}
          <div className="text-center bg-primary/5 p-12 rounded-2xl">
            <h3 className="text-3xl font-bold text-primary">Reimagine your pasta like never before</h3>
            <h4 className="text-2xl text-gray-700 font-semibold mb-4">You dream it, we make it.</h4>
            <p className="text-gray-700 mb-8">
              From classic combinations to bold new flavors, your perfect pasta dish is just waiting to be created. Take control of your pasta experience and let us bring your culinary vision to life. Create your very own signature pasta dish today!
            </p>
            <button onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} 
                    className="bg-primary text-white px-10 py-2 rounded-full font-semibold hover:bg-primary/90 transition-colors w-64 mx-auto block">
              Start Creating Your Pasta
            </button>
          </div>
        </div>
      </section>
      <section id="contact" className="mt-10 text-center">
        <SectionHeaders 
          subHeader="Any Enquiries?"
          mainHeader="Contact Us"
        />
        <div className="mt-4">
          <a className="text-2xl text-gray-800 hover:text-primary transition-colors" href="mailto:support@pastaexpress.com">
            support@pastaexpress.com
        </a>
        </div>
      </section>
    </>
  );
}
