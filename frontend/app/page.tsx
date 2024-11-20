import { CourtSchedule } from "./components/court-schedule";
import { Footer } from "./components/footer";
import { InfoDialog } from "./components/info-dialog";
import { DateDisplay } from "./components/date-display";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex h-14 items-center justify-between">
          <DateDisplay />
          <InfoDialog />
        </div>
      </header>
      <div className="flex-1">
        <CourtSchedule />
      </div>
      <Footer />
    </main>
  );
}
