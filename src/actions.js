import {createAction} from 'redux-actions';

import {ADD_META, REMOVE_META} from './constants';

/**
 * Redux action for adding any depth of metadata to the Redux state
 * @param {{}} meta Object containing all metadata which should be stored
 * @returns {{}} Redux action to be dispatched
 */
export const addMeta = createAction(ADD_META, meta => ({meta}));

/**
 * Redux action for removing metadata from the Redux state
 * @param {string|string[]|{}} metaToRemove The metadata which should be removed from the Redux state
 * @returns {{}} Redux action to be dispatched
 */
export const removeMeta = createAction(REMOVE_META, remove => ({remove}));
