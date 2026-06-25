# Schema Option Modes

Default `formOptions` is defaultValues-first. The default values are taken at face value and validator callbacks infer from that shape.

`strictSchema` is schema-source pipeline mode. Defaults must align with the schema input type, and submit code should read parsed output from `schemaOutputs`.

`looseSchema` is schema-source ruleset mode with editable defaults. Defaults must match the schema shape but may include `null` or `undefined` where editing requires it. Submit code still reads parsed output from `schemaOutputs`.

Callbacks in schema modes may not infer the expected value type unless there is a schema in the validator array.

The pipeline-vs-ruleset distinction is TanStack Form guidance, not a Standard Schema concept.
