import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { screen, within } from '@testing-library/dom';
import '@testing-library/jest-dom';
import DataAvailabilityCell from './TableCell';

let container;
const render = (element) => act(() => { ReactDOM.render(element, container); });

beforeEach(() => {
  jest.useFakeTimers();
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  act(() => { jest.runOnlyPendingTimers(); });
  jest.useRealTimers();
});

const hoverIndicator = async () => {
  const icon = container.querySelector('svg');
  icon.getBoundingClientRect = () => ({ top: 0, left: 0, right: 18, bottom: 18, width: 18, height: 18 });
  await act(async () => {
    Simulate.mouseOver(icon);
    jest.advanceTimersByTime(200);
  });
  return within(screen.getByRole('tooltip'));
};

const renderRepositories = (repositories) => render(<DataAvailabilityCell
  dataField="unique_repository"
  unique_repository={repositories.map((repository) => repository.repository_name)}
  repositories={repositories}
/>);

it('shows only the configured parent name linked to its general repository portal', async () => {
  renderRepositories([{
    repository_name: 'TCIA',
    repository_url: 'https://nbia.cancerimagingarchive.net/',
  }]);
  const tooltip = await hoverIndicator();

  expect(tooltip.getAllByText('TCIA')).toHaveLength(1);
  expect(tooltip.getAllByRole('link')).toHaveLength(1);
  const link = tooltip.getByRole('link', { name: 'TCIA' });
  expect(tooltip.getByRole('img', { name: 'External link icon' })).toBeInTheDocument();
  expect(link).toHaveAttribute('href', 'https://nbia.cancerimagingarchive.net/');
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

it('displays links for every configured repository, including newly configured repositories', async () => {
  renderRepositories([
    { repository_name: 'TCIA', repository_url: 'https://nbia.cancerimagingarchive.net/' },
    { repository_name: 'New Archive', repository_url: 'https://example.org/' },
  ]);
  const tooltip = await hoverIndicator();
  expect(tooltip.getAllByText('TCIA')).toHaveLength(1);
  expect(tooltip.getAllByText('New Archive')).toHaveLength(1);
  expect(tooltip.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
    'https://nbia.cancerimagingarchive.net/', 'https://example.org/',
  ]);
});

it('displays a repository with no URL as text without a placeholder link', async () => {
  renderRepositories([{ repository_name: 'Other Archive', repository_url: null }]);
  const tooltip = await hoverIndicator();
  expect(tooltip.getByText('Other Archive')).toBeInTheDocument();
  expect(tooltip.queryByRole('link')).not.toBeInTheDocument();
  expect(tooltip.queryByRole('img')).not.toBeInTheDocument();
});

it('does not show an indicator for an empty repository list', () => {
  renderRepositories([]);
  expect(container.querySelector('svg')).toBeNull();
});

it('preserves the Image Collections count tooltip', async () => {
  render(<DataAvailabilityCell dataField="image_collection_count" image_collection_count={2} />);
  await hoverIndicator();
  expect(screen.getByRole('tooltip')).toHaveTextContent('2 Image Collection(s)');
});
