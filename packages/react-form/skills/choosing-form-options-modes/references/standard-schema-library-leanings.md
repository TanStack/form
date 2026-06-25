# Standard Schema Library Leanings

Use library leanings as heuristics, not hard categories.

Zod often leans ruleset/firewall for form work. Use loose schema mode when UI defaults need nullish intermediate values such as an unselected date.

Valibot often leans pipeline because its API centers `pipe` and validation/transformation actions. Use strict schema mode when the schema is an input-to-output pipeline.

ArkType is mixed. Structural constraints often read like a firewall, while morphs and pipes can make a schema pipeline-like.

Effect Schema often leans pipeline/codec when it represents an encoded-to-decoded boundary.
