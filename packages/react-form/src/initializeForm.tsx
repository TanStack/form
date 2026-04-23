import React, { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { createForm } from "@tanstack/form-core-v2";

// types
import type {  FieldApi, FormApi, FormOptions } from "@tanstack/form-core-v2";

export function initializeForm<TData>(options: FormOptions<TData>) {
    const form = createForm(options)

    function Field(props: FieldProps) {
        const fieldApi = useMemo(() => form._requestField(props.name), [props.name])

        useStore(fieldApi.store, state => state.value)

        return <></>;
    }

}

interface ReactFormApi<TData> extends FormApi<TData> {
    Field: React.FC<FieldProps>
}

interface FieldProps {
    name: string
    children: (fieldApi: FieldApi) => React.ReactNode
}

