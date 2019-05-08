import extend from 'deep-extend';
import omit from 'object.omit';

import {ADD_META} from '../constants';
import {addMeta, removeMeta} from '../actions';
import {initialState, reducer} from '../reducer';

describe('Reducer', () => {
  let state = {
    some: {
      nested: {
        meta: 'data',
      },
      hello: 'goodbye',
    },
    shallow: 'meta',
    simple: 4,
    arr: [
      0,
      1,
      {
        abc: 123,
        id: 'xyz987',
      },
    ],
  };
  const stateSnapshot = extend({}, state);

  afterEach(() => {
    // Reset state to ensure it is not mutated by any test
    state = extend({}, stateSnapshot);
  });

  it('initializes correctly', () => {
    expect(reducer(undefined, {type: '@@INIT'})).toEqual(initialState);
  });

  it('ignores other actions correctly', () => {
    const action = {
      type: 'UNKNOWN_TYPE',
      payload: {
        meta: {
          goodbye: 'hello',
        },
      },
    };
    const updatedState = reducer(state, action);
    expect(updatedState).toBe(state);
    expect(updatedState).toEqual(stateSnapshot);
  });

  describe('handles addMeta actions', () => {
    it('adds valid metadata correctly', () => {
      const action = addMeta({
        some: {
          nested: {
            other: 'metadata',
          },
          hello: 'goodbye again',
        },
        simple: 8,
        arr: [17],
      });
      expect(reducer(state, action)).toEqual({
        some: {
          nested: {
            meta: 'data',
            other: 'metadata',
          },
          hello: 'goodbye again',
        },
        shallow: 'meta',
        simple: 8,
        arr: [17],
      });
      // Test that previous state was not altered in any way
      expect(state).toEqual(stateSnapshot);
    });

    describe('ignores invalid addMeta actions', () => {
      it('handles missing meta', () => {
        const action = {
          type: ADD_META,
          payload: {},
        };
        expect(reducer(state, action)).toBe(state);
        expect(state).toEqual(stateSnapshot);
      });

      it('handles meta of invalid type', () => {
        const action = {
          type: ADD_META,
          payload: {
            meta: 'something',
          },
        };
        expect(reducer(state, action)).toBe(state);
        expect(state).toEqual(stateSnapshot);
      });

      it('handles meta of Array', () => {
        const action = {
          type: ADD_META,
          payload: {
            meta: ['something'],
          },
        };
        expect(reducer(state, action)).toBe(state);
        expect(state).toEqual(stateSnapshot);
      });
    });
  });

  describe('handles removeMeta actions correctly', () => {
    describe('removes metadata for valid actions', () => {
      describe('handles string argument', () => {
        it('simple', () => {
          const action = removeMeta('shallow');
          expect(reducer(state, action)).toEqual(
            omit(stateSnapshot, 'shallow')
          );
          expect(state).toEqual(stateSnapshot);
        });

        it('nested', () => {
          const action = removeMeta('some.nested');
          expect(reducer(state, action)).toEqual({
            ...stateSnapshot,
            some: omit(stateSnapshot.some, 'nested'),
          });
          expect(state).toEqual(stateSnapshot);
        });

        it('missing path', () => {
          const action = removeMeta('not.real.meta.path');
          expect(reducer(state, action)).toEqual(stateSnapshot);
          expect(state).toEqual(stateSnapshot);
        });
      });

      describe('handles array argument', () => {
        it('valid mixed array', () => {
          const action = removeMeta(['shallow', 'some.hello']);
          expect(reducer(state, action)).toEqual({
            ...omit(stateSnapshot, 'shallow'),
            some: omit(stateSnapshot.some, 'hello'),
          });
          expect(state).toEqual(stateSnapshot);
        });

        it('mixed array - some missing paths', () => {
          const action = removeMeta([
            'does.not.exist.path',
            'arr.2',
            'also.missing',
          ]);
          expect(reducer(state, action)).toEqual({
            ...stateSnapshot,
            arr: [...stateSnapshot.arr.slice(0, 2), undefined],
          });
          expect(state).toEqual(stateSnapshot);
        });

        it('mixed array - some invalid paths', () => {
          const action = removeMeta([
            'does.not.exist.path',
            'arr.2.id',
            {path: 'also.missing'},
          ]);
          expect(reducer(state, action)).toEqual({
            ...stateSnapshot,
            arr: [
              ...stateSnapshot.arr.slice(0, 2),
              {...omit(stateSnapshot.arr[2], 'id')},
            ],
          });
          expect(state).toEqual(stateSnapshot);
        });

        it('all invalid or missing paths', () => {
          const action = removeMeta(['does.not.exist', 18, () => {}]);
          expect(reducer(state, action)).toEqual(stateSnapshot);
          expect(state).toEqual(stateSnapshot);
        });
      });

      describe('handles object argument', () => {
        it('handles valid object', () => {
          const action = removeMeta({
            arr: true,
            shallow: true,
          });
          expect(reducer(state, action)).toEqual(
            omit(stateSnapshot, ['arr', 'shallow'])
          );
          expect(state).toEqual(stateSnapshot);
        });

        it('handles some missing paths', () => {
          const action = removeMeta({
            some: {
              nested: {
                doesNotExist: true,
              },
              hello: true,
            },
          });
          expect(reducer(state, action)).toEqual({
            ...stateSnapshot,
            some: omit(stateSnapshot.some, 'hello'),
          });
          expect(state).toEqual(stateSnapshot);
        });

        it('handles all missing paths', () => {
          const action = removeMeta({
            some: {
              nested: {
                doesNotExist: true,
              },
            },
            other: true,
            arr2: [true, true],
          });
          expect(reducer(state, action)).toEqual(stateSnapshot);
          expect(state).toEqual(stateSnapshot);
        });

        it('handles empty object', () => {
          const action = removeMeta({});
          expect(reducer(state, action)).toEqual(stateSnapshot);
          expect(state).toEqual(stateSnapshot);
        });
      });
    });
  });
});
