"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function InfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2">
          <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border rounded-2xl">
        <DialogHeader>
          <DialogTitle>About The Schedule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <section>
            <h3 className="font-medium mb-2">How to Read the Schedule</h3>
            <p className="text-sm text-muted-foreground">
              Each court shows available time slots for the day. Time slots are
              displayed in 2-hour blocks (the allowed bookable increments).
            </p>
          </section>
          <section>
            <h3 className="font-medium mb-2">Availability Status</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">Available</Badge>
                <span className="text-sm">
                  Court is free for this time slot
                </span>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Badge variant="destructive">Booked</Badge>
                <span className="text-sm">
                  Court is reserved for this time slot
                </span>
              </div>
            </div>
          </section>
          <section>
            <h3 className="font-medium mb-2">Data Updates</h3>
            <p className="text-sm text-muted-foreground">
              Schedule information is collected right before the booking window
              closes on the booking website to ensure today's availability is
              accurate.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
