import axios from "axios";
import yaml from "js-yaml";
import env from "../../../../../utils/env";

// Module-level cache to avoid re-fetching YAML on every mount
let nodeDescriptionCache = null;
let nodeDescriptionPromise = null;

/**
 * Fetches and parses node descriptions from YAML data model
 * Uses module-level cache to fetch only once per app session
 *
 * @returns {Promise<Object>} Node descriptions keyed by node name
 * @throws {Error} If YAML fetch or parsing fails
 *
 * @example
 * const descriptions = await fetchNodeDescriptions();
 * console.log(descriptions.diagnosis); // "Diagnosis node description..."
 */
export const fetchNodeDescriptions = async () => {
  // Return cached value if available
  if (nodeDescriptionCache) {
    return nodeDescriptionCache;
  }

  // Return existing promise if fetch is in progress (deduplication)
  if (nodeDescriptionPromise) {
    return nodeDescriptionPromise;
  }

  // Start new fetch
  nodeDescriptionPromise = (async () => {
    try {
      const DATA_MODEL_URL = env.REACT_APP_DATA_MODEL;

      if (!DATA_MODEL_URL) {
        throw new Error("REACT_APP_DATA_MODEL environment variable is not set");
      }

      const response = await axios.get(DATA_MODEL_URL);
      const dictionary = yaml.load(response.data);

      if (!dictionary?.Nodes) {
        throw new Error("Invalid YAML structure: missing Nodes");
      }

      const { Nodes: allNodes } = dictionary;

      // Build description dictionary
      const descriptions = Object.keys(allNodes).reduce((acc, nodeName) => {
        acc[nodeName] = allNodes[nodeName]?.Desc || "";
        return acc;
      }, {});

      // Cache the result
      nodeDescriptionCache = descriptions;
      return descriptions;
    } catch (error) {
      console.error("Failed to fetch node descriptions:", error);
      // Reset promise to allow retry on next call
      nodeDescriptionPromise = null;
      throw error;
    }
  })();

  return nodeDescriptionPromise;
};

/**
 * Clears the cached node descriptions (useful for testing or forced refresh)
 */
export const clearNodeDescriptionCache = () => {
  nodeDescriptionCache = null;
  nodeDescriptionPromise = null;
};

/**
 * Returns cached descriptions synchronously if available, null otherwise
 * @returns {Object|null} Cached node descriptions or null
 */
export const getCachedDescriptions = () => nodeDescriptionCache;
