import React, { useMemo } from "react";
import { useStore } from "@tanstack/react-store";

import { InternalFormApi } from "@tanstack/form-core-v2/internals";

// types
import type {  FieldApi, FormApi, FormOptions } from "@tanstack/form-core-v2";

export function initializeForm<TData>(options: FormOptions<TData>) {
    const form = new InternalFormApi(options)

    function Field(props: FieldProps<TData>) {
        const fieldApi = useMemo(() => form._requestField(props.name), [props.name])

        useStore(fieldApi.store, state => state.value)

        return <></>;
    }

}

interface ReactFormApi<TData> extends FormApi<TData> {
    Field: React.FC<FieldProps<TData>>
}

interface FieldProps<TData> {
    name: string
    children: (fieldApi: FieldApi<TData>) => React.ReactNode
}

