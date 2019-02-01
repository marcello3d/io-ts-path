import * as t from 'io-ts';
import { WildCard } from './path';
import { path, query } from './to-path';

describe('path', () => {
  it('works on basic type', () => {
    const Person = t.type({
      name: t.string,
      age: t.number,
      fullName: t.type({
        first: t.string,
        last: t.string,
      }),
    });
    expect(path(query(Person).name)).toEqual(['name']);
    expect(path(query(Person).fullName.first)).toEqual(['fullName', 'first']);
  });

  it('works on partial type', () => {
    const Person = t.partial({
      name: t.string,
      age: t.number,
      fullName: t.type({
        first: t.string,
        last: t.string,
      }),
    });
    expect(path(query(Person).name)).toEqual(['name']);
    expect(path(query(Person).fullName.first)).toEqual(['fullName', 'first']);
  });

  it('works on strict type', () => {
    const Person = t.strict({
      name: t.string,
      age: t.number,
      fullName: t.type({
        first: t.string,
        last: t.string,
      }),
    });
    expect(path(query(Person).name)).toEqual(['name']);
    expect(path(query(Person).fullName.first)).toEqual(['fullName', 'first']);
  });

  it('works on exact type', () => {
    const Person = t.exact(
      t.type({
        name: t.string,
        age: t.number,
        fullName: t.type({
          first: t.string,
          last: t.string,
        }),
      }),
    );
    expect(path(query(Person).name)).toEqual(['name']);
    expect(path(query(Person).fullName.first)).toEqual(['fullName', 'first']);
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
    expect(path(query(Model).users._.name)).toEqual([
      'users',
      WildCard,
      'name',
    ]);
  });

  it('works on dictionary type with key', () => {
    const Model = t.type({
      users: t.dictionary(
        t.string,
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(path(query(Model).users.item('123').name)).toEqual([
      'users',
      '123',
      'name',
    ]);
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
    expect(path(query(Model).users._.name)).toEqual([
      'users',
      WildCard,
      'name',
    ]);
  });

  it('works on array type with index', () => {
    const Model = t.type({
      users: t.array(
        t.type({
          name: t.string,
          age: t.number,
        }),
      ),
    });
    expect(path(query(Model).users.item(4).name)).toEqual(['users', 4, 'name']);
  });

  it('works on dictionary type', () => {
    const Model = t.type({
      users: t.dictionary(
        t.string,
        t.type({
          name: t.string,
          age: t.number,
          books: t.array(t.string),
        }),
      ),
    });
    expect(path(query(Model).users)).toEqual(['users']);
  });

  it('works on array wildcard in dictionary', () => {
    const Model = t.type({
      users: t.dictionary(
        t.string,
        t.type({
          name: t.string,
          age: t.number,
          books: t.array(t.string),
        }),
      ),
    });
    expect(path(query(Model).users.item('123').books._)).toEqual([
      'users',
      '123',
      'books',
      WildCard,
    ]);
  });
});
