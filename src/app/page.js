import Hero from "./components/layout/hero";
import HomeMenu from "./components/layout/HomeMenu";
import SectionHeaders from "./components/layout/sectionheaders";
export default function Home() {

  return (
    <>
      <Hero />
      <HomeMenu />
      <section>
        <SectionHeaders 
          subHeader="Our Story"
        mainHeader="About Us"
      />
      <div className="text-center text-gray-800 max-w-3xl mx-auto flex flex-col gap-4 mt-2">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Voluptatibus,
          quae, quod, voluptates quia voluptatum quibusdam voluptatem quas quidem natus doloribus. 
          Quisquam, quos. Voluptatibus, quae, quod, voluptates quia voluptatum quibusdam voluptatem
          quas quidem natus doloribus. Quisquam, quos. Voluptatibus, quae, quod, voluptates quia
          voluptatum quibusdam voluptatem quas quidem natus doloribus.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        </p>
        </div>
      </section>
      <section className="mt-10 text-center">
        <SectionHeaders 
          subHeader="Any Enquiries?"
          mainHeader="Contact Us"
        />
        <div className="mt-8">
          <a className="text-4xl" href="tel:+6590098503">
            +65 9009 8503
        </a>
        </div>
      </section>
    </>
  );
}
