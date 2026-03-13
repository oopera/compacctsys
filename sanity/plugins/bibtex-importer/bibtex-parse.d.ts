declare module "bibtex-parse" {
  export interface BibtexEntry {
    key: string;
    type: string;
    [field: string]: string | number | null | undefined;
  }

  export function entries(input: string, options?: object): BibtexEntry[];
  export function parse(input: string, options?: object): unknown[];

  const _default: { parse: typeof parse; entries: typeof entries };
  export default _default;
}
