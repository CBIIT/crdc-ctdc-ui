import { createStore, createHook } from 'react-sweet-state';

const initialState = {
  isModalOpen: false,
  currentTab: 0,
};

const actions = {
  setIsModalOpen:
    (isModalOpen) =>
    ({ setState }) => {
      setState({
        isModalOpen,
      });
    },
};

const Store = createStore({
  initialState,
  actions,
  name: 'biospecimen-profile-modal-state',
});

export const useBiospecimenProfileModal = createHook(Store);
