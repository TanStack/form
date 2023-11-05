export function sleep(timeout: number): Promise<void> {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, timeout)
  })
}

interface Kid {
  name: string;
  age: number
}
export interface Person {
  name: string
  kids: Kid[]
  mother: {name: string}
}
export function makeComplexFormStructure(): Person {
  return {name: 'Marc', kids: [{name: 'Stephen', age: 10}, {name: 'Taylor', age: 15}], mother: {
    name: 'Lisa'
    }};
}
