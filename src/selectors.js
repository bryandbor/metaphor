import {get} from 'dotty';
import {createSelector} from 'reselect';

/**
 * Get Metadata from Redux state
 * @param {*} state Root Redux state
 * @returns {{}} Metaphor Redux state
 */
export const getMeta = state => get(state, 'meta') || {};

export const getNthArg = argNum => (...args) => args[argNum];

/**
 * Creates a selector which will read metadata from the Redux store and return a default value (if provided)
 * @param {string} path The dotty path leading to the desired metadata
 * @param {*} [defaultValue] The default value to be returned if metadata is undefined within Redux state
 * @returns {Function} Selector to be called with Redux state
 */
export const createMetaValueSelector = (path, defaultValue) =>
  createSelector(
    getMeta,
    meta => {
      const value = get(meta, path);
      return value !== undefined ? value : defaultValue;
    }
  );

/**
 * Selector for reading metadata from the Redux store
 * @param {{}} state Redux state
 * @param {string} path The dotty path leading to the desired metadata
 * @param {*} [defaultValue] The default value to be returned if the metadata is undefined within Redux state
 * @returns {*} The metadata from the Redux store (or the default value if metadata is undefined)
 */
export const getMetaValue = createSelector(
  getMeta,
  getNthArg(1),
  getNthArg(2),
  (meta, path, defaultValue) => {
    const value = get(meta, path);
    return value !== undefined ? value : defaultValue;
  }
);
