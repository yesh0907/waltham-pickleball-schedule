import { CourtSchedule } from "./components/court-schedule";
import { Footer } from "./components/footer";
import { InfoDialog } from "./components/info-dialog";

export default function Home() {
  const today = new Date();
  const month = today.toLocaleString("default", { month: "short" });
  const date = today.getDate();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="flex h-14 items-center justify-between">
          <h1 className="text-lg font-semibold">
            {`${month} ${date}`} Pickleball Court Schedule
          </h1>
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
