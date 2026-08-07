import type {
  ComponentOptionsMixin,
  CreateComponentPublicInstanceWithMixins,
  EmitsOptions,
  PublicProps,
  SlotsType,
} from 'vue'

export type VueComponentInstance<
  TProps extends Record<string, any>,
  TSlots extends Record<string, any>,
> = CreateComponentPublicInstanceWithMixins<
  TProps,
  {},
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  EmitsOptions,
  PublicProps,
  {},
  false,
  {},
  SlotsType<TSlots>
>

export type VueComponentWithSlots<
  TProps extends Record<string, any>,
  TSlots extends Record<string, any>,
> = new (props: TProps & PublicProps) => VueComponentInstance<TProps, TSlots>
