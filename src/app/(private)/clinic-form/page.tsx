import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ClinicForm from "./components/form";

export default function ClinicFormPage() {
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Adicionar clínica</DialogTitle>
          <DialogDescription>
            Adicione uma clínica para continuar.
          </DialogDescription>
        </DialogHeader>
        <ClinicForm />
        
      </DialogContent>
    </Dialog>
  );
}
