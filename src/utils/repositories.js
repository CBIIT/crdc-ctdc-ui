import axios from 'axios';
import yaml from 'js-yaml';

export const REPOSITORIES_CONTENT_PATH = '/repositories/repositories.yml';

const trimString = (value) => (typeof value === 'string' ? value.trim() : '');
const normalizeName = (name) => name.trim().toLowerCase();

const requiredName = (value) => {
  const name = trimString(value);
  if (!name) throw new Error('Repository names and aliases must be nonblank strings.');
  return name;
};

const repositoryUrl = (value) => {
  if (value == null) return null;
  if (typeof value !== 'string') throw new Error('repository_url must be a string or null.');
  const url = value.trim();
  if (!url) return null;
  const parsed = new URL(url);
  if (!['https:', 'http:'].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password) {
    throw new Error('repository_url must be an absolute HTTP(S) URL without credentials.');
  }
  return url;
};

// Build the complete lookup before using any configuration, so invalid files cannot supply links.
export const parseRepositoryConfig = (content) => {
  const config = yaml.safeLoad(content);
  if (!Array.isArray(config?.repositories)) {
    throw new Error('repositories.yml must contain a repositories list.');
  }
  const lookup = new Map();
  config.repositories.forEach((entry) => {
    const repository = {
      repository_name: requiredName(entry?.repository_name),
      repository_url: repositoryUrl(entry?.repository_url),
    };
    const aliases = entry.aliases == null ? [] : entry.aliases;
    if (!Array.isArray(aliases)) throw new Error('Repository aliases must be a list.');
    [repository.repository_name, ...aliases.map(requiredName)].forEach((name) => {
      const key = normalizeName(name);
      const previous = lookup.get(key);
      if (previous && (previous.repository_name !== repository.repository_name
        || previous.repository_url !== repository.repository_url)) {
        throw new Error(`Conflicting repository name or alias: ${name}`);
      }
      lookup.set(key, repository);
    });
  });
  return lookup;
};

export const loadRepositoryConfig = async (staticContentUrl) => {
  const baseUrl = trimString(staticContentUrl);
  if (!baseUrl || /^\$\{[^}]+\}$/.test(baseUrl)) return new Map();
  const { data } = await axios.get(
    `${baseUrl.replace(/\/+$/, '')}${REPOSITORIES_CONTENT_PATH}`,
    { timeout: 10000 },
  );
  return parseRepositoryConfig(data);
};

// Association comes from image_collection.repository_name, never a collection name or DOI.
export const getImageCollectionRepositories = (imageCollections, lookup = new Map()) => {
  const repositories = new Map();
  (Array.isArray(imageCollections) ? imageCollections : []).forEach((collection) => {
    const sourceName = trimString(collection?.repository_name);
    if (!sourceName) return;
    const repository = lookup.get(normalizeName(sourceName)) || {
      repository_name: sourceName,
      repository_url: null,
    };
    const key = normalizeName(repository.repository_name);
    if (!repositories.has(key)) repositories.set(key, repository);
  });
  return Array.from(repositories.values());
};
