const ACTION_TYPES = {
  CREATE_ARTICLE: 'CREATE_ARTICLE',
  READ_LIST: 'READ_LIST',
  UPDATE_ARTICLE: 'UPDATE_ARTICLE',
  DELETE_ARTICLE: 'DELETE_ARTICLE'
}

const INITIAL_STATE = {
  articles: [],
  isLoading: false,
  error: false
}

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
          default:
              return state;
      }
}

const createStore = (reducer) => {
  let currentState = INITIAL_STATE
  let currentReducer = reducer

  // Actions
  const createArticle = (article) => _dispatch({ type: INITIAL_STATE.CREATE_ARTICLE, article });

  // Public methods
  const getState = () => { return currentState };

  // Private methods
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
    getState,
    createArticle
  }
}

// Export store
export const store = createStore(appReducer)