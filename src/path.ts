export const WildCard = Symbol('wildcard');

export type Path = Array<string | number | typeof WildCard>;

export class PathError extends Error {
  constructor(
    message: string,
    public readonly path: Path,
    public readonly pathIndex: number,
  ) {
    super(`${message} at /${path.slice(0, pathIndex + 1).join('/')}`);
  }
}
