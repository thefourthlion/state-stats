import { title } from "@/components/primitives";
import Map from "../components/Map";
export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
        <Map />
      </div>

    
    </section>
  );
}