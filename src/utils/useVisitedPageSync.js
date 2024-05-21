import { useEffect } from 'react';
import { LAST_VISITED_HASH_KEY } from '../bento/siteWideConfig';

// Function to get the hash portion of the URL Ex. https://example.com/#/explore => #/explore
function getCurrentHash() {
  return window.location.hash;
}

function setLocalStorage(currentHash) {
  localStorage.setItem(LAST_VISITED_HASH_KEY, currentHash);
}

// Custom hook to synchronize the hash portion of the URL with local storage
function useVisitedPageSync() {
  const currentHash = getCurrentHash();

  useEffect(() => {
    // Update localStorage with the hash value whenever the URL changes
    if (currentHash !== "#/user/login") setLocalStorage(currentHash);
  }, [currentHash]);
}

export default useVisitedPageSync;