export enum Variant {
  PRIMARY ,
  SECONDARY ,
  TERTIARY,
}

export function getVariantBackgroundStyles(variant:Variant){

  switch (variant) {
    case Variant.PRIMARY:
      return 'bg-rose-600  hover:bg-rose-700 active:bg-rose-800'
    case Variant.SECONDARY:
      return 'bg-pink-600 hover:bg-pink-700 active:bg-pink-800'
    case Variant.TERTIARY:
      return 'bg-purple-600  hover:bg-purple-700 active:bg-purple-800'
  }
}

export function getVariantOutlineStyles(variant:Variant){

  switch (variant) {
    case Variant.PRIMARY:
      return 'outline outline-rose-600 '
    case Variant.SECONDARY:
      return ' outline outline-pink-600'
    case Variant.TERTIARY:
      return ' outline outline-purple-600'
  }
}

  export function getVariantBorderStyles(variant:Variant){

  switch (variant) {
    case Variant.PRIMARY:
      return 'border-2 outline-rose-800'
    case Variant.SECONDARY:
      return 'border-2 outline-pink-800'
    case Variant.TERTIARY:
      return 'border-2 outline-purple-800'
  }
}

  export function getVariantInputTextStyles(variant:Variant){

  switch (variant) {
    case Variant.PRIMARY:
      return 'text-black'
    case Variant.SECONDARY:
      return 'text-black'
    case Variant.TERTIARY:
      return 'text-black'
  }
}
