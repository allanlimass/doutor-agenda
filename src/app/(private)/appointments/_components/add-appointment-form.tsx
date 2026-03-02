"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { addAppointment } from "@/actions/add-appointment";
import { getAvailableTimes } from "@/actions/get-available-times";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

const formSchema = z.object({
  patientId: z.string().min(1, {
    message: "Paciente é obrigatório.",
  }),
  doctorId: z.string().min(1, {
    message: "Médico é obrigatório",
  }),
  appointmentPrice: z.number().min(1, {
    message: "Valor da consulta é obrigatório.",
  }),
  date: z.date({
    message: "Data é obrigatória.",
  }),
  time: z.string({
    message: "Horário é obrigatório.",
  }),
});

interface AddAppointmentFormProps {
  isOpen: boolean;
  patients: (typeof patientsTable.$inferSelect)[];
  doctors: (typeof doctorsTable.$inferSelect)[];
  appointment?: typeof appointmentsTable.$inferSelect | null;
  onSuccess?: () => void;
}

export default function AddAppointmentForm({
  isOpen,
  patients,
  doctors,
  appointment,
  onSuccess,
}: AddAppointmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      doctorId: appointment?.doctorId ?? "",
      appointmentPrice: appointment?.appointmentPriceInCents
        ? appointment.appointmentPriceInCents / 100
        : 0,
      date: appointment?.date ? new Date(appointment.date) : undefined,
      time: appointment?.date
        ? format(new Date(appointment.date), "HH:mm:ss")
        : "",
    },
  });

  const selectedPatientId = form.watch("patientId");
  const selectedDoctorId = form.watch("doctorId");
  const selectedDate = form.watch("date");

  const { data: availableTimes } = useQuery({
    queryKey: ["available-times", selectedDate, selectedDoctorId],
    queryFn: () =>
      getAvailableTimes({
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        doctorId: selectedDoctorId,
      }),
    enabled: !!selectedDate && !!selectedDoctorId,
  });

  useEffect(() => {
    if (selectedDoctorId) {
      const selectedDoctor = doctors.find(
        (doctor) => doctor.id === selectedDoctorId,
      );
      if (selectedDoctor) {
        form.setValue(
          "appointmentPrice",
          selectedDoctor.appointmentPriceInCents / 100,
        );
      }
    }
  }, [selectedDoctorId, doctors, form]);

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: appointment?.patientId ?? "",
        doctorId: appointment?.doctorId ?? "",
        appointmentPrice: appointment?.appointmentPriceInCents
          ? appointment.appointmentPriceInCents / 100
          : 0,
        date: appointment?.date ? new Date(appointment.date) : undefined,
        time: appointment?.date
          ? format(new Date(appointment.date), "HH:mm:ss")
          : "",
      });
    }
  }, [appointment, isOpen, form]);

  const addAppointmentAction = useAction(addAppointment, {
    onSuccess: () => {
      toast.success(
        appointment
          ? "Agendamento atualizado com sucesso."
          : "Agendamento criado com sucesso.",
      );
      onSuccess?.();
    },
    onError: () => {
      toast.error(
        appointment
          ? "Erro ao atualizar agendamento."
          : "Erro ao criar agendamento.",
      );
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addAppointmentAction.execute({
      ...values,
      id: appointment?.id,
      appointmentPriceInCents: values.appointmentPrice * 100,
    });
  };

  const isDateAvailable = (date: Date) => {
    if (!selectedDoctorId) return false;
    const selectedDoctor = doctors.find(
      (doctor) => doctor.id === selectedDoctorId,
    );
    if (!selectedDoctor) return false;
    const dayOfWeek = date.getDay();
    return (
      dayOfWeek >= selectedDoctor?.availableFromWeekDay &&
      dayOfWeek <= selectedDoctor?.availableToWeekDay
    );
  };

  const isDateTimeEnabled = selectedPatientId && selectedDoctorId;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {appointment ? "Editar agendamento" : "Adicionar agendamento"}
        </DialogTitle>
        <DialogDescription>
          {appointment
            ? "Edite as informações do agendamento."
            : "Crie um novo agendamento para sua clínica."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Controller
              name="patientId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Paciente</FieldLabel>
                  <Select
                    name="patientId"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="doctorId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Médico</FieldLabel>
                  <Select
                    name="doctorId"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="appointmentPrice"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Valor</FieldLabel>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value.floatValue);
                    }}
                    decimalScale={2}
                    fixedDecimalScale
                    decimalSeparator=","
                    thousandSeparator="."
                    prefix="R$ "
                    allowNegative={false}
                    customInput={Input}
                    disabled={!selectedDoctorId}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Data</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || !isDateAvailable(date)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="time"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Horário</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!isDateTimeEnabled || !selectedDate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um horário" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTimes?.data?.map((time) => (
                        <SelectItem
                          key={time.value}
                          value={time.value}
                          disabled={!time.available}
                        >
                          {time.label} {!time.available && "(Indisponível)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={addAppointmentAction.isPending}>
              {addAppointmentAction.isPending
                ? "Criando..."
                : "Criar agendamento"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
