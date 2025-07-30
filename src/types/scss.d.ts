declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const exports: { [key: string]: string };
  export default exports;
}
