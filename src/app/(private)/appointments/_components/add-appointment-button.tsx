"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { doctorsTable, patientsTable } from "@/db/schema";

import AddAppointmentForm from "./add-appointment-form";

interface AddAppointmentButtonProps {
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
}

export default function AddAppointmentButton({
  patients,
  doctors,
}: AddAppointmentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Adicionar agendamento
        </Button>
      </DialogTrigger>
      <AddAppointmentForm
        isOpen={isOpen}
        patients={patients}
        doctors={doctors}
        onSuccess={() => setIsOpen(false)}
      />
    </Dialog>
  );
}
