// @ts-check
/** @import {Article, UsualProduct} from '../classes/ShopArticle.js' */

/**
 * @module redux/store
 */

/**
 * @typedef {Object} ActionTypeArticle
 * @property {string} type
 * @property {Article | UsualProduct } [article]
 */
/**
 * @typedef {Object} ActionTypeRoute
 * @property {string} type
 * @property {string} [route]
 */
/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} email
 * @property {string} [password]
 * @property {string} token
 * @property {string} role
 */
/**
 * @typedef {Object} ActionTypeUser
 * @property {string} type
 * @property {User} [user]
 */
const ACTION_TYPES = {
  // Article
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  READ_LIST: 'READ_LIST',
  UPDATE_ARTICLE: 'UPDATE_ARTICLE',
  DELETE_ARTICLE: 'DELETE_ARTICLE',
  DELETE_ALL_ARTICLES: 'DELETE_ALL_ARTICLES',
  // Route
  SET_ROUTE: 'SET_ROUTE',
  // User
  // LOGIN: 'LOGIN',
  // LOGOUT: 'LOGOUT',
}

/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<Article | UsualProduct>} articles
 * @property {boolean} isLoading
 * @property {boolean} error
 * @property {string} route
 */
/**
 * @type {State}
 */
export const INITIAL_STATE = {
  articles: [],
  isLoading: false,
  error: false,
  route: '/',
  // user: {}
}

/**
 * Reducer for the app state.
 *
 * @param {State} state - The current state
 * @param {ActionTypeArticle | ActionTypeRoute | ActionTypeUser} action - The action to reduce
 * @returns {State} The new state
 */
const appReducer = (state = INITIAL_STATE, action) => {
  const actionWithArticle = /** @type {ActionTypeArticle} */(action)
  const actionWithRoute = /** @type {ActionTypeRoute} */(action)
  // const actionWithUser = /** @type {ActionTypeUser} */(action)
  switch (action.type) {
    case ACTION_TYPES.CREATE_ARTICLE:
      return {
        ...state,
        articles: [
          ...state.articles,
          actionWithArticle.article
        ]
      };
    case ACTION_TYPES.READ_LIST:
      return state
    case ACTION_TYPES.UPDATE_ARTICLE:
      return {
        ...state,
        articles: state.articles.map((/** @type {Article | UsualProduct} */article) => {
          if (article._id === actionWithArticle?.article?._id) {
            return actionWithArticle.article
          }
          return article
        })
      };
    case ACTION_TYPES.DELETE_ARTICLE:
      return {
        ...state,
        articles: state.articles.filter((/** @type {Article | UsualProduct} */article) => article._id !== actionWithArticle?.article?._id)
      };
    case ACTION_TYPES.DELETE_ALL_ARTICLES:
      return {
        ...state,
        articles: []
      };
    case ACTION_TYPES.SET_ROUTE:
      return {
        ...state,
        route: actionWithRoute.route
      };
    // case ACTION_TYPES.LOGIN:
    //   return {
    //     ...state,
    //     user: actionWithUser.user
    //   };
    // case ACTION_TYPES.LOGOUT:
    //   return {
    //     ...state,
    //     user: {}
    //   };
    default:
      return {...state};
  }
}

/**
 * @typedef {Object} PublicMethods
 * @property {function} create
 * @property {function} read
 * @property {function} update
 * @property {function} delete
 * @property {function} getById
 * @property {function} getAll
 * @property {function} deleteAll
 */
/**
 * @typedef {Object} PublicRoute
 * @property {function} get
 * @property {function} set
 */
/**
 * @typedef {Object} PublicUser
 * @property {function} login
 * @property {function} logout
 */
/**
 * @typedef {Object} Store
 * @property {function} getState
 * @property {PublicMethods} article
 * @property {PublicRoute} route
 */
/**
 * Creates the store singleton.
 * @param {appReducer} reducer
 * @returns {Store}
 */
const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Actions
  /**
   * Creates a new Article inside the store
   * @param {Article} article
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const createArticle = (article, onEventDispatched) => _dispatch({ type: ACTION_TYPES.CREATE_ARTICLE, article }, onEventDispatched);
  /**
   * Reads the list of articles
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const readList = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.READ_LIST }, onEventDispatched);
  /**
   * Updates an article
   * @param {Article} article
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const updateArticle = (article, onEventDispatched) => _dispatch({ type: ACTION_TYPES.UPDATE_ARTICLE, article }, onEventDispatched);
  /**
   * Deletes an article
   * @param {Article} article
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  const deleteArticle = (article, onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_ARTICLE, article }, onEventDispatched);

  /**
   * Deletes all the articles
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   * */
  const deleteAllArticles = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.DELETE_ALL_ARTICLES }, onEventDispatched);

  // Public methods
  /**
   *
   * @returns {State}
   */
  const getState = () => { return currentState };
  /**
   * Returns the article with the specified id
   * @param {string} id
   * @returns {Article | UsualProduct | undefined}
   */
  const getArticleById = (id) => { return currentState.articles.find((/** @type {Article | UsualProduct} */article) => article._id === id) };

  /**
   * Returns all the articles
   * @returns {Array<Article | UsualProduct>}
   */
  const getAllArticles = () => { return currentState.articles };

  /**
   * Sets current route
   * @param {string} route
   * @param {function | undefined} onEventDispatched
   * @returns string
   */
  const setRoute = (route, onEventDispatched) => _dispatch({ type: ACTION_TYPES.SET_ROUTE, route }, onEventDispatched)

  /**
   * Logs in the user
   * @param {User} user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  // const login = (user, onEventDispatched) => _dispatch({ type: ACTION_TYPES.LOGIN, user }, onEventDispatched)

  /**
   * Logs out the user
   * @param {function | undefined} [onEventDispatched]
   * @returns void
   */
  // const logout = (onEventDispatched) => _dispatch({ type: ACTION_TYPES.LOGOUT }, onEventDispatched)

  // Private methods
  /**
   *
   * @param {ActionTypeArticle | ActionTypeRoute} action
   * @param {function | undefined} [onEventDispatched]
   */
  const _dispatch = (action, onEventDispatched) => {
    let previousValue = currentState;
    let currentValue = currentReducer(currentState, action);
    currentState = currentValue;
    // TODO: CHECK IF IS MORE ADDECUATE TO SWITCH TO EventTarget: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
    window.dispatchEvent(new CustomEvent('stateChanged', {
        detail: {
          type: action.type,
          changes: _getDifferences(previousValue, currentValue)
        },
        cancelable: true,
        composed: true,
        bubbles: true
    }));
    if (onEventDispatched) {
      // console.log('onEventDispatched', onEventDispatched);
      onEventDispatched();
      // onEventDispatched.call(this, {
      //   type: action.type,
      //   changes: _getDifferences(previousValue, currentValue)
      // })
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

  // Namespaced actions
  /** @type {PublicMethods} */
  const article = {
    create: createArticle,
    read: readList,
    update: updateArticle,
    delete: deleteArticle,
    getById: getArticleById,
    getAll: getAllArticles,
    deleteAll: deleteAllArticles
  }

  /** @type {PublicRoute} */
  const route = {
    get: () => currentState.route,
    set: setRoute
  }

  /** @type {PublicUser} */
  // const user = {
  //   login,
  //   logout
  // }

  return {
    // Actions
    article,
    route,
    // user,
    // Public methods
    getState
  }
}

// Export store
export const store = createStore(appReducer)