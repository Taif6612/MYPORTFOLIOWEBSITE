/* Ambient type for the `virtual:guides` module produced by src/cms/plugin.ts.
   (An ambient `declare module` can't use a relative import, so the type is
   referenced with an inline import() instead.) */
declare module "virtual:guides" {
  export const guides: import("./types").Guide[];
}
