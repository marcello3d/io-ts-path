import {
  Any,
  ArrayType,
  DictionaryType,
  ExactType,
  InterfaceType,
  PartialType,
  Props,
  ReadonlyArrayType,
  StrictType,
  TypeOf,
} from 'io-ts';
import { Path, WildCard } from './path';

export type Query<T extends Any> = T extends
  | InterfaceType<infer P>
  | PartialType<infer P>
  | StrictType<infer P>
  | ExactType<InterfaceType<infer P>>
  | ExactType<PartialType<infer P>>
  ? P extends Props
    ? { [K in keyof P]: Query<P[K]> }
    : {}
  : T extends DictionaryType<infer Key, infer Element>
  ? {
      _: Query<Element>;
      item(k: TypeOf<Key>): Query<Element>;
    }
  : T extends
      | ArrayType<infer ArrayElement>
      | ReadonlyArrayType<infer ArrayElement>
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
  if (
    type instanceof InterfaceType ||
    type instanceof PartialType ||
    type instanceof StrictType
  ) {
    Object.keys(type.props).forEach((key) => {
      p[key] = query(type.props[key], [...basePath, key]);
    });
  } else if (type instanceof DictionaryType) {
    p._ = query(type.codomain, [...basePath, WildCard]);
    p.item = (key: string) => query(type.codomain, [...basePath, key]);
  } else if (type instanceof ArrayType || type instanceof ReadonlyArrayType) {
    p._ = query(type.type, [...basePath, WildCard]);
    p.item = (index: number) => query(type.type, [...basePath, index]);
  } else if (type instanceof ExactType) {
    return query(type.type, basePath) as Query<T>;
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
