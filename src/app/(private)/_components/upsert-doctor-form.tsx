"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Form, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import z from "zod";

import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { medicalSpecialties } from "../_constants";

const formSchema = z
  .object({
    name: z.string().trim().min(1, {
      message: "Nome é obrigatório.",
    }),
    specialty: z.string().trim().min(1, {
      message: "Especialidade é obrigatória.",
    }),
    appointmentPrice: z.number().min(1, {
      message: "Preço de consulta é obrigatório.",
    }),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z.string().min(1, {
      message: "Hora de início é obrigatória.",
    }),
    availableToTime: z.string().min(1, {
      message: "Hora de término é obrigatória.",
    }),
  })
  .refine(
    (data) => {
      return data.availableFromTime < data.availableToTime;
    },
    {
      message:
        "O horário de início não pode ser anterior ao horário de término.",
      path: ["availableToTime"],
    },
  );

export default function UpsertDoctorForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentPrice: 0,
      availableFromWeekDay: "1",
      availableToWeekDay: "5",
      availableFromTime: "06:00:00",
      availableToTime: "17:00:00",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar médico</DialogTitle>
        <DialogDescription>Adicione um novo médico.</DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nome</FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  placeholder="Digite o nome do médico"
                  autoComplete="off"
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
            name="specialty"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Especialidade</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
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
                <FieldLabel>Preço</FieldLabel>
                <NumericFormat
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value.floatValue);
                  }}
                  decimalScale={2}
                  fixedDecimalScale
                  decimalSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  customInput={Input}
                  prefix="R$ "
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
            name="availableFromWeekDay"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Dia inicial de disponibilidade</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione um dia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Domingo</SelectItem>
                    <SelectItem value="1">Segunda</SelectItem>
                    <SelectItem value="2">Terça</SelectItem>
                    <SelectItem value="3">Quarta</SelectItem>
                    <SelectItem value="4">Quinta</SelectItem>
                    <SelectItem value="5">Sexta</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
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
            name="availableToWeekDay"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Dia final de disponibilidade</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Selecione um dia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Domingo</SelectItem>
                    <SelectItem value="1">Segunda</SelectItem>
                    <SelectItem value="2">Terça</SelectItem>
                    <SelectItem value="3">Quarta</SelectItem>
                    <SelectItem value="4">Quinta</SelectItem>
                    <SelectItem value="5">Sexta</SelectItem>
                    <SelectItem value="6">Sábado</SelectItem>
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
            name="availableFromTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Horário inicial de disponibilidade</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Manhã</SelectLabel>
                      <SelectItem value="05:00:00">05:00</SelectItem>
                      <SelectItem value="05:30:00">05:30</SelectItem>
                      <SelectItem value="06:00:00">06:00</SelectItem>
                      <SelectItem value="06:30:00">06:30</SelectItem>
                      <SelectItem value="07:00:00">07:00</SelectItem>
                      <SelectItem value="07:30:00">07:30</SelectItem>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="08:30:00">08:30</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="09:30:00">09:30</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="10:30:00">10:30</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="11:30:00">11:30</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                      <SelectItem value="12:30:00">12:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="13:30:00">13:30</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="14:30:00">14:30</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="15:30:00">15:30</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="16:30:00">16:30</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                      <SelectItem value="17:30:00">17:30</SelectItem>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="18:30:00">18:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Noite</SelectLabel>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="19:30:00">19:30</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="20:30:00">20:30</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="21:30:00">21:30</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                      <SelectItem value="22:30:00">22:30</SelectItem>
                      <SelectItem value="23:00:00">23:00</SelectItem>
                      <SelectItem value="23:30:00">23:30</SelectItem>
                    </SelectGroup>
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
            name="availableToTime"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Horário final de disponibilidade</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Manhã</SelectLabel>
                      <SelectItem value="05:00:00">05:00</SelectItem>
                      <SelectItem value="05:30:00">05:30</SelectItem>
                      <SelectItem value="06:00:00">06:00</SelectItem>
                      <SelectItem value="06:30:00">06:30</SelectItem>
                      <SelectItem value="07:00:00">07:00</SelectItem>
                      <SelectItem value="07:30:00">07:30</SelectItem>
                      <SelectItem value="08:00:00">08:00</SelectItem>
                      <SelectItem value="08:30:00">08:30</SelectItem>
                      <SelectItem value="09:00:00">09:00</SelectItem>
                      <SelectItem value="09:30:00">09:30</SelectItem>
                      <SelectItem value="10:00:00">10:00</SelectItem>
                      <SelectItem value="10:30:00">10:30</SelectItem>
                      <SelectItem value="11:00:00">11:00</SelectItem>
                      <SelectItem value="11:30:00">11:30</SelectItem>
                      <SelectItem value="12:00:00">12:00</SelectItem>
                      <SelectItem value="12:30:00">12:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Tarde</SelectLabel>
                      <SelectItem value="13:00:00">13:00</SelectItem>
                      <SelectItem value="13:30:00">13:30</SelectItem>
                      <SelectItem value="14:00:00">14:00</SelectItem>
                      <SelectItem value="14:30:00">14:30</SelectItem>
                      <SelectItem value="15:00:00">15:00</SelectItem>
                      <SelectItem value="15:30:00">15:30</SelectItem>
                      <SelectItem value="16:00:00">16:00</SelectItem>
                      <SelectItem value="16:30:00">16:30</SelectItem>
                      <SelectItem value="17:00:00">17:00</SelectItem>
                      <SelectItem value="17:30:00">17:30</SelectItem>
                      <SelectItem value="18:00:00">18:00</SelectItem>
                      <SelectItem value="18:30:00">18:30</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Noite</SelectLabel>
                      <SelectItem value="19:00:00">19:00</SelectItem>
                      <SelectItem value="19:30:00">19:30</SelectItem>
                      <SelectItem value="20:00:00">20:00</SelectItem>
                      <SelectItem value="20:30:00">20:30</SelectItem>
                      <SelectItem value="21:00:00">21:00</SelectItem>
                      <SelectItem value="21:30:00">21:30</SelectItem>
                      <SelectItem value="22:00:00">22:00</SelectItem>
                      <SelectItem value="22:30:00">22:30</SelectItem>
                      <SelectItem value="23:00:00">23:00</SelectItem>
                      <SelectItem value="23:30:00">23:30</SelectItem>
                    </SelectGroup>
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
          <Button type="submit">Adicionar</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
