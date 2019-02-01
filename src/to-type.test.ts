import * as t from 'io-ts';
import { WildCard } from './path';
import { type } from './to-type';

describe('toType', () => {
  it('works on basic type', () => {
    const Person = t.type({
      name: t.string,
      age: t.number,
      fullName: t.type({
        first: t.string,
        last: t.string,
      }),
    });
    expect(type(Person, ['age'])).toBe(t.number);
    expect(type(Person, ['fullName', 'last'])).toBe(t.string);
  });
  it('works on partial type', () => {
    const Person = t.partial({
      name: t.string,
    });
    expect(type(Person, ['name'])).toBe(t.string);
  });
  it('works on strict type', () => {
    const Person = t.strict({
      name: t.string,
    });
    expect(type(Person, ['name'])).toBe(t.string);
  });
  it('works on exact type', () => {
    const Person = t.exact(
      t.type({
        name: t.string,
      })
    );
    expect(type(Person, ['name'])).toBe(t.string);
  });
  it('fails on interface with number field', () => {
    const Model = t.type({
      name: t.string,
    });
    expect(() => type(Model, [5])).toThrowError(`Expected string at /5`);
  });

  it('works on dictionary type with wildcard', () => {
    const Model = t.type({
      users: t.dictionary(
        t.string,
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(type(Model, ['users', WildCard, 'name'])).toBe(t.string);
  });

  it('works on dictionary type with string', () => {
    const Model = t.type({
      users: t.dictionary(
        t.string,
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(type(Model, ['users', 'foo', 'name'])).toBe(t.string);
  });
  it('fails on dictionary type with number', () => {
    const Model = t.type({
      users: t.dictionary(
        t.string,
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(() => type(Model, ['users', 5, 'name'])).toThrowError(
      `Expected string or Wildcard at /users/5`,
    );
  });

  it('works on array type with wildcard', () => {
    const Model = t.type({
      users: t.array(
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(type(Model, ['users', WildCard, 'name'])).toBe(t.string);
  });
  it('works on array type with number', () => {
    const Model = t.type({
      users: t.array(
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(type(Model, ['users', 4, 'name'])).toBe(t.string);
  });
  it('fails on array type with string', () => {
    const Model = t.type({
      users: t.array(
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(() => type(Model, ['users', 'string', 'name'])).toThrowError(
      `Expected number or Wildcard at /users/string`,
    );
  });
  it('fails when entering', () => {
    const Model = t.type({
      name: t.string,
    });
    expect(() => type(Model, ['name', 'length'])).toThrowError(
      `Type [string] cannot be inspected at /name/length`,
    );
  });
});
