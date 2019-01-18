# io-ts-path 
[![CircleCI](https://circleci.com/gh/marcello3d/io-ts-path.svg?style=svg)](https://circleci.com/gh/marcello3d/io-ts-path) 
[![npm version](https://badge.fury.io/js/io-ts-path.svg)](https://badge.fury.io/js/io-ts-path)
[![codecov](https://codecov.io/gh/marcello3d/io-ts-path/branch/master/graph/badge.svg)](https://codecov.io/gh/marcello3d/io-ts-path)

Generate type-safe paths from [io-ts](https://github.com/gcanti/io-ts) models.

Basic usage:
```typescript
import * as t from 'io-ts';
import { query, path } from 'io-ts-path';

const Person = t.type({
  name: t.string,
  age: t.number,
  fullName: t.type({
    first: t.string,
    last: t.string
  })
});

path(query(Person).name)
// => ['name']

path(query(Person).fullName.first)
// => ['fullName', 'first']
```

Usage with dictionaries and arrays:
```typescript
import * as t from 'io-ts';
import { query, path, WildCard } from 'io-ts-path';

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

path(query(Model).users._.books)
// => ['users', WildCard, 'books']
```
