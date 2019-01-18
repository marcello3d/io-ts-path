import {
  Any,
  ArrayType,
  DictionaryType,
  InterfaceType,
  Props,
  TypeOf,
} from 'io-ts';

export const WildCard = { wild: 'card' };

export type Path = Array<string | number | typeof WildCard>;

export type Query<T extends Any> = T extends InterfaceType<infer P>
  ? P extends Props
    ? { [K in keyof P]: Query<P[K]> }
    : {}
  : T extends DictionaryType<infer Key, infer Element>
  ? {
      _: Query<Element>;
      item(k: TypeOf<Key>): Query<Element>;
    }
  : T extends ArrayType<infer ArrayElement>
  ? {
      _: Query<ArrayElement>;
      item(i: number): Query<ArrayElement>;
    }
  : {};

type QueryPrivate<T extends Any> = {
  ____: { p: Path };
} & Query<T>;

/**
 * Returns a query object for a given io-ts type
 *
 * @param type io-ts type
 * @param basePath base path to prepend
 */
export function query<T extends Any>(type: T, basePath: Path = []): Query<T> {
  const p: any = {
    ____: {
      p: basePath,
    },
  };
  if (type instanceof InterfaceType) {
    Object.keys(type.props).forEach((key) => {
      p[key] = query(type.props[key], [...basePath, key]);
    });
  } else if (type instanceof DictionaryType) {
    p._ = query(type.codomain, [...basePath, WildCard]);
    p.item = (key: string) => query(type.codomain, [...basePath, key]);
  } else if (type instanceof ArrayType) {
    p._ = query(type.type, [...basePath, WildCard]);
    p.item = (index: number) => query(type.type, [...basePath, index]);
  }
  return (p as unknown) as Query<T>;
}

/**
 * Return the path of a given query
 *
 * @param query
 */
// tslint:disable-next-line:no-shadowed-variable
export function path<T extends Any>(query: Query<T>): Path {
  const q = query as QueryPrivate<T>;
  return q.____.p;
}
