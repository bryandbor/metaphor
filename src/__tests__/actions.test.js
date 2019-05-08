import {ADD_META, REMOVE_META} from '../constants';

import {addMeta, removeMeta} from '../actions';

describe('Actions | addMeta', () => {
  it('creates action correctly', () => {
    const meta = {
      something: {
        nested: {
          key: 'value',
        },
        other: 4,
      },
      arr: [0, 'b'],
    };
    expect(addMeta(meta)).toEqual({
      type: ADD_META,
      payload: {
        meta,
      },
    });
  });
});

describe('Actions | removeMeta', () => {
  it('creates action correctly (string value)', () => {
    const remove = 'some.path';
    expect(removeMeta(remove)).toEqual({
      type: REMOVE_META,
      payload: {
        remove,
      },
    });
  });

  it('creates action correctly (array value)', () => {
    const remove = ['some.path', 'some.other.path'];
    expect(removeMeta(remove)).toEqual({
      type: REMOVE_META,
      payload: {
        remove,
      },
    });
  });
});
