import extend from 'deep-extend';
import {get, remove, deepKeys} from 'dotty';
import {handleActions} from 'redux-actions';

import {ADD_META, REMOVE_META} from './constants';

export const initialState = {};

export const reducer = handleActions(
  {
    [ADD_META]: (state, action) => {
      const meta = get(action, 'payload.meta');
      // If payload does not contain the meta key of type Object, return original state
      if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
        return state;
      }
      return extend({}, state, meta);
    },
    [REMOVE_META]: (state, action) => {
      const metaToRemove = get(action, 'payload.remove');
      // If payload does not contain remove key of type string or Array, return original state
      if (
        !(typeof metaToRemove === 'string' || typeof metaToRemove === 'object')
      ) {
        return state;
      }

      // Deep copy original state
      const updatedState = extend({}, state);

      // If meta to remove is a string, remove that path (if it exists)
      if (typeof metaToRemove === 'string') {
        remove(updatedState, metaToRemove);

        // If meta to remove is an array, remove each path
      } else if (Array.isArray(metaToRemove)) {
        metaToRemove.forEach(path => {
          if (typeof path !== 'string') {
            return;
          }
          remove(updatedState, path);
        });

        // If meta to remove is an object, remove each deep key
      } else {
        deepKeys(metaToRemove, {leavesOnly: true}).forEach(path =>
          remove(updatedState, path)
        );
      }

      return updatedState;
    },
  },
  initialState
);
