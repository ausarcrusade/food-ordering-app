

export default function SectionHeaders({subHeader,mainHeader}) {
    return (
        <div className="text-center">
            <h3 className="text-2xl font-semibold uppercase">
                {subHeader}
            </h3>
            <h2 className="text-4xl text-primary font-bold">
                {mainHeader}
            </h2>
        </div>
    );
}