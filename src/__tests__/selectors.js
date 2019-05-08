import extend from 'deep-extend';
import omit from 'object.omit';

import {
  getMeta,
  getNthArg,
  createMetaValueSelector,
  getMetaValue,
} from '../selectors';

describe('Selectors | getMeta', () => {
  it('returns default when state does not exist', () => {
    expect(getMeta(undefined)).toEqual({});
    expect(getMeta({})).toEqual({});
    expect(getMeta({other: 'value'})).toEqual({});
  });
  it('returns meta state', () => {
    const meta = {
      something: {
        nested: '',
      },
      other: 123,
    };
    expect(getMeta({other: 'value', meta})).toEqual(meta);
  });
});

describe('Selectors | getNthArg', () => {
  it('returns correct arg', () => {
    const args = ['a', 1, 'b', 3, 'c', 5];
    args.forEach((_, index) => {
      expect(getNthArg(index)(...args)).toEqual(args[index]);
    });
  });
});

describe('Selectors | getMetaValue', () => {
  const meta = {
    simple: 'ABC',
    something: {
      nested: {
        hello: 123,
        goodbye: 'xyz',
      },
    },
    other: ['a', 'b', {key: 'value'}],
    boo: false,
  };

  it('handles missing values', () => {
    expect(createMetaValueSelector('missing')(meta)).toEqual(undefined);
    expect(createMetaValueSelector('missing', 'default value')(meta)).toEqual(
      'default value'
    );
  });

  it('returns value correctly', () => {
    // Testing simple values
    expect(createMetaValueSelector('simple').resultFunc(meta)).toEqual(
      meta.simple
    );
    expect(createMetaValueSelector('boo').resultFunc(meta)).toEqual(meta.boo);
    expect(createMetaValueSelector('missing').resultFunc(meta)).toEqual(
      undefined
    );

    // Testing Array values
    expect(createMetaValueSelector('other').resultFunc(meta)).toEqual(
      meta.other
    );
    expect(createMetaValueSelector('other.0').resultFunc(meta)).toEqual(
      meta.other[0]
    );
    expect(createMetaValueSelector('other.1').resultFunc(meta)).toEqual(
      meta.other[1]
    );
    expect(createMetaValueSelector('other.2').resultFunc(meta)).toEqual(
      meta.other[2]
    );
    expect(createMetaValueSelector('other.2.key').resultFunc(meta)).toEqual(
      meta.other[2].key
    );
    expect(createMetaValueSelector('other.2.missing').resultFunc(meta)).toEqual(
      undefined
    );
    expect(createMetaValueSelector('other.3').resultFunc(meta)).toEqual(
      undefined
    );

    // Testing Object values
    expect(createMetaValueSelector('something').resultFunc(meta)).toEqual(
      meta.something
    );
    expect(
      createMetaValueSelector('something.missing').resultFunc(meta)
    ).toEqual(undefined);
    expect(
      createMetaValueSelector('something.nested').resultFunc(meta)
    ).toEqual(meta.something.nested);
    expect(
      createMetaValueSelector('something.nested.hello').resultFunc(meta)
    ).toEqual(meta.something.nested.hello);
    expect(
      createMetaValueSelector('something.nested.goodbye').resultFunc(meta)
    ).toEqual(meta.something.nested.goodbye);
    expect(
      createMetaValueSelector('something.nested.missing').resultFunc(meta)
    ).toEqual(undefined);
  });
});

describe('Selectors | getMetaValue', () => {
  const meta = {
    simple: 'ABC',
    something: {
      nested: {
        hello: 123,
        goodbye: 'xyz',
      },
    },
    other: ['a', 'b', {key: 'value'}],
    boo: false,
  };

  it('handles missing values', () => {
    expect(getMetaValue(meta, 'missing')).toEqual(undefined);
    expect(getMetaValue(meta, 'missing', 'default value')).toEqual(
      'default value'
    );
  });

  it('returns value correctly', () => {
    // Testing simple values
    expect(getMetaValue.resultFunc(meta, 'simple')).toEqual(meta.simple);
    expect(getMetaValue.resultFunc(meta, 'boo')).toEqual(meta.boo);
    expect(getMetaValue.resultFunc(meta, 'missing')).toEqual(undefined);

    // Testing Array values
    expect(getMetaValue.resultFunc(meta, 'other')).toEqual(meta.other);
    expect(getMetaValue.resultFunc(meta, 'other.0')).toEqual(meta.other[0]);
    expect(getMetaValue.resultFunc(meta, 'other.1')).toEqual(meta.other[1]);
    expect(getMetaValue.resultFunc(meta, 'other.2')).toEqual(meta.other[2]);
    expect(getMetaValue.resultFunc(meta, 'other.2.key')).toEqual(
      meta.other[2].key
    );
    expect(getMetaValue.resultFunc(meta, 'other.2.missing')).toEqual(undefined);
    expect(getMetaValue.resultFunc(meta, 'other.3')).toEqual(undefined);

    // Testing Object values
    expect(getMetaValue.resultFunc(meta, 'something')).toEqual(meta.something);
    expect(getMetaValue.resultFunc(meta, 'something.missing')).toEqual(
      undefined
    );
    expect(getMetaValue.resultFunc(meta, 'something.nested')).toEqual(
      meta.something.nested
    );
    expect(getMetaValue.resultFunc(meta, 'something.nested.hello')).toEqual(
      meta.something.nested.hello
    );
    expect(getMetaValue.resultFunc(meta, 'something.nested.goodbye')).toEqual(
      meta.something.nested.goodbye
    );
    expect(getMetaValue.resultFunc(meta, 'something.nested.missing')).toEqual(
      undefined
    );
  });
});
