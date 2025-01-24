// @ts-check
import { Article, UsualProduct } from "../classes/ShopArticle";

/**
 * @typedef {Object} ActionType
 * @property {string} type
 * @property {Article |UsualProduct} article
 */
const ACTION_TYPES = {
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  READ_LIST: 'READ_LIST',
  UPDATE_ARTICLE: 'UPDATE_ARTICLE',
  DELETE_ARTICLE: 'DELETE_ARTICLE'
}

/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<UsualProduct | Article>} articles
 * @property {boolean} isLoading
 * @property {boolean} error
 */
/**
 * @type {State}
 */
const INITIAL_STATE = {
  articles: [],
  isLoading: false,
  error: false
}

/**
 * Reducer for the app state.
 *
 * @param {State} state - The current state
 * @param {ActionType} action - The action to reduce
 * @returns {State} The new state
 * @example
 * const state = {
 *   articles: [
 *     { id: 1, name: 'Apple Watch' }
 *   ]
 * }
 * const action = {
 *   type: ACTION_TYPES.CREATE_ARTICLE,
 *   article: { id: 2, name: 'iPhone' }
 * }
 * const newState = appReducer(state, action)
 * console.log(newState)
 * // {
 * //   articles: [
 * //     { id: 1, name: 'Apple Watch' },
 * //     { id: 2, name: 'iPhone' }
 * //   ]
 * // }
 */
const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTION_TYPES.CREATE_ARTICLE:
      return {
        ...state,
        articles: [
          ...state.articles,
          action.article
        ]
      };
    case ACTION_TYPES.READ_LIST:
      return state
    case ACTION_TYPES.UPDATE_ARTICLE:
      return {
        ...state,
        articles: state.articles.map((/** @type {Article | UsualProduct} */article) => {
          if (article.id === action.article.id) {
            return action.article
          }
          return article
        })
      };
    case ACTION_TYPES.DELETE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter((/** @type {Article | UsualProduct} */article) => article.id !== action.article.id)
      };
    default:
      return state;
  }
}

/**
 * Creates the store singleton.
 * @param {appReducer} reducer
 * @returns {Object}
 */
const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Actions
  /**
   * Creates a new Article inside the store
   * @param {Article} article
   * @returns void
   */
  const createArticle = (article) => _dispatch({ type: ACTION_TYPES.CREATE_ARTICLE, article });

  // Public methods
  const getState = () => { return currentState };
  /**
   * Returns the article with the specified id
   * @param {string} id
   * @returns {Article | UsualProduct | undefined}
   */
  const getArticleById = (id) => { return currentState.articles.find((/** @type {Article | UsualProduct} */article) => article.id === id) };

  // Private methods
  /**
   *
   * @param {ActionType} action
   * @param {function | undefined} [onEventDispatched]
   */
  const _dispatch = (action, onEventDispatched) => {
    let previousValue = currentState;
    let currentValue = currentReducer(currentState, action);
    currentState = currentValue;
    // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: {
            changes: _getDifferences(previousValue, currentValue)
        },
        cancelable: true,
        composed: true,
        bubbles: true
    }));
    if (onEventDispatched) {
        onEventDispatched();
    }
  }
  /**
   * Returns a new object with the differences between the `previousValue` and
   * `currentValue` objects. It's used to create a payload for the "stateChanged"
   * event, which is dispatched by the store every time it changes.
   *
   * @param {State} previousValue - The old state of the store.
   * @param {State} currentValue - The new state of the store.
   * @returns {Object} - A new object with the differences between the two
   *     arguments.
   * @private
   */
  const _getDifferences = (previousValue, currentValue) => {
    return Object.keys(currentValue).reduce((diff, key) => {
        if (previousValue[key] === currentValue[key]) return diff
        return {
            ...diff,
            [key]: currentValue[key]
        };
    }, {});
  }

  return {
    // Actions
    createArticle,
    // Public methods
    getState,
    getArticleById
  }
}

// Export store
export const store = createStore(appReducer)