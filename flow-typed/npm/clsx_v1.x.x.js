// flow-typed signature: 5e68c4df1fc585166155388fcdbb9128
// flow-typed version: e8047e772a/clsx_v1.x.x/flow_>=v0.30.x

declare module 'clsx' {
  declare type Classes = 
    | Array<Classes>
    | { [className: string]: * }
    | string
    | number
    | boolean
    | void
    | null;

  declare module.exports: (...classes: Array<Classes>) => string;
}
