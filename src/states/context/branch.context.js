import React, {useReducer, createContext} from 'react';

const DEFAULT_BRANCH = {nearbyBranch: [], allBranch: [], selectedBranch: null};

export const BranchContext = createContext();

export const BranchContextProvider = (props) => {
  const [branch, dispatchBranch] = useReducer(reducer, DEFAULT_BRANCH);

  return (
    <BranchContext.Provider value={{branch, dispatchBranch}}>
      {props.children}
    </BranchContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_BRANCH':
      return {...state, nearbyBranch: [...action.payload]};
    case 'SET_BRANCH_PAGINATION':
      return {...state, nearbyBranch: [...state.nearbyBranch, ...action.payload]};
    case 'SET_ALL_BRANCH':
      return {...state, allBranch: [...action.payload]};
    case 'SET_SELECTED_BRANCH':
      return {
        ...state,
        selectedBranch: action.payload,
      };
    default:
      throw new Error();
  }
};
