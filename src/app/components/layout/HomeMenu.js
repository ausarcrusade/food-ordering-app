import Image from "next/image";
import SectionHeaders from "./sectionheaders";
import MenuItem from "../menu/MenuItem";
export default function HomeMenu() {
    return (
        <section>
            <SectionHeaders 
                subHeader="Our Menu"
                mainHeader="Popular Pasta"
            />

            <div className="grid grid-cols-3 gap-4 my-10">
            <MenuItem />
            <MenuItem />
            <MenuItem />
            <MenuItem />
            <MenuItem />
            <MenuItem />
        </div>
        </section>
    );
}