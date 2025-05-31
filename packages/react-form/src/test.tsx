import { useStore } from "@tanstack/react-store";
import { useForm } from "./useForm";

function TestComp() {
  const form = useForm({
    defaultValues: { a: ''}
  })

  const derived = useStore(form.store, state => state.values)
}