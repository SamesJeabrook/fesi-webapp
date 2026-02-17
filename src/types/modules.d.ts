// CSS Modules type declarations
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// CSS and other asset imports
declare module '*.css';
declare module '*.scss';
declare module 'mapbox-gl/dist/mapbox-gl.css';
