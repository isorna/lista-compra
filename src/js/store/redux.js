const ACTION_TYPES = {
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  READ_LIST: 'READ_LIST',
  UPDATE_ARTICLE: 'UPDATE_ARTICLE',
  DELETE_ARTICLE: 'DELETE_ARTICLE'
}

const INITIAL_STATE = {
  list: [],
  isLoading: false,
  error: false
}

const appReducer = (state = INITIAL_STATE, action) => {}

const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Actions

  // Public methods
}
// Store:
export const store = createStore(appReducer);