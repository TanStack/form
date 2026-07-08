declare const brand: unique symbol

type Branding<T> = {
  [brand]?: T
}

type Branded<TConstraint, TBrand> = TConstraint & Branding<TBrand>

export type FormId = Branded<string, 'instanceId'>
