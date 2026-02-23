"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const clinicFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatório" }),
});

export default function ClinicForm() {
  const form = useForm<z.infer<typeof clinicFormSchema>>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof clinicFormSchema>) => {
    try {
      await createClinic(data.name);
    } catch (error) {
      if (isRedirectError(error)) {
        return;
      }
      console.log(error);
      toast.error("Erro ao criar clínica.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="Digite o nome da clínica"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Criar clínica
          </Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
}
