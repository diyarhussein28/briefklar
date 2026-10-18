import { ConsentGate } from "@/features/consent/ConsentGate";
import { HomeScreen } from "@/features/scan/HomeScreen";

export default function Home() {
  return (
    <ConsentGate>
      <HomeScreen />
    </ConsentGate>
  );
}
