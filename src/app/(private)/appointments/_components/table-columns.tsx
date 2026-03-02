"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

import AppointmentsTableActions from "./table-actions";

type AppointmentWithRelations = typeof appointmentsTable.$inferSelect & {
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    sex: "male" | "female";
  };
  doctor: {
    id: string;
    name: string;
    specialty: string;
  };
};

export const appointmentsTableColumns: ColumnDef<AppointmentWithRelations>[] = [
  {
    id: "date",
    accessorKey: "date",
    header: "Data",
    cell: (params) => {
      const appointment = params.row.original;
      return format(new Date(appointment.date), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    },
  },
  {
    id: "patient",
    accessorKey: "patient.name",
    header: "Paciente",
  },
  {
    id: "doctor",
    accessorKey: "doctor.name",
    header: "Médico",
  },
  {
    id: "specialty",
    accessorKey: "doctor.specialty",
    header: "Especialidade",
  },
  {
    id: "price",
    accessorKey: "appointmentPriceInCents",
    header: "Valor",
    cell: (params) => {
      const appointment = params.row.original;
      const price = appointment.appointmentPriceInCents / 100;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const appointment = row.original;
      const { patients, doctors } = table.options.meta as {
        patients: (typeof patientsTable.$inferSelect)[];
        doctors: (typeof doctorsTable.$inferSelect)[];
      };

      return (
        <AppointmentsTableActions
          appointment={appointment}
          patients={patients}
          doctors={doctors}
        />
      );
    },
  },
];
