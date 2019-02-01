import {
  Any,
  ArrayType,
  DictionaryType,
  ExactType,
  InterfaceType,
  PartialType,
  ReadonlyArrayType,
  StrictType,
} from 'io-ts';
import { Path, PathError } from './path';

export function type(baseType: Any, path: Path): Any {
  for (let i = 0; i < path.length; i++) {
    if (baseType instanceof ExactType) {
      baseType = baseType.type;
    }
    const pathElement = path[i];
    if (
      baseType instanceof InterfaceType ||
      baseType instanceof PartialType ||
      baseType instanceof StrictType
    ) {
      if (typeof pathElement !== 'string') {
        throw new PathError('Expected string', path, i);
      }
      baseType = baseType.props[pathElement];
    } else if (
      baseType instanceof ArrayType ||
      baseType instanceof ReadonlyArrayType
    ) {
      if (typeof pathElement === 'string') {
        throw new PathError('Expected number or Wildcard', path, i);
      }
      baseType = baseType.type;
    } else if (baseType instanceof DictionaryType) {
      if (typeof pathElement === 'number') {
        throw new PathError('Expected string or Wildcard', path, i);
      }
      baseType = baseType.codomain;
    } else {
      throw new PathError(
        `Type [${baseType.name}] cannot be inspected`,
        path,
        i,
      );
    }
  }
  return baseType;
}
