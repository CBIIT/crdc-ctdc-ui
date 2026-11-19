import React from 'react';
import { render as rtlRender, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PortfolioCard from './PortfolioCard';

// The title and study count are router links, so the card needs a router.
const render = (ui) => rtlRender(<MemoryRouter>{ui}</MemoryRouter>);

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockHistoryPush }),
}));

const baseProps = {
  name: 'Test Program',
  identifier: 'TP',
  description: 'A curated description.',
  externalUrl: 'https://example.com',
  studies: [
    { study_short_name: 'STUDY-1', study_name: 'Study One' },
    { study_short_name: 'STUDY-2', study_name: 'Study Two' },
  ],
  image: 'https://example.com/image.png',
  imageAlt: 'Test Program image',
};

// The count is split into a bold number (with two trailing spaces) and a regular-weight label, so match on the
// combined text with whitespace collapsed.
const getCount = (text) => screen.getByText((_, element) => element.children.length === 2
  && element.textContent.replace(/\s+/g, ' ') === text);

describe('PortfolioCard', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear();
  });

  it('renders the program name as a heading', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(screen.getByText('Test Program')).toBeInTheDocument();
  });

  it('renders the study count formatted as "{N} Associated Studies"', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(getCount('2 Associated Studies')).toBeInTheDocument();
  });

  it('renders the description paragraph', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(screen.getByText('A curated description.')).toBeInTheDocument();
  });

  it('falls back gracefully when no description is configured', () => {
    render(<PortfolioCard {...baseProps} description="" />);
    expect(screen.getByText('No description available.')).toBeInTheDocument();
  });

  it('renders the primary image with alt text', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(screen.getByAltText('Test Program image')).toBeInTheDocument();
  });

  it('does not render an image when none is configured', () => {
    render(<PortfolioCard {...baseProps} image={undefined} />);
    expect(screen.queryByAltText('Test Program image')).not.toBeInTheDocument();
  });

  it('renders an Associated Studies button', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(screen.getByRole('button', { name: 'Associated Studies' })).toBeInTheDocument();
  });

  it('renders a Resource Link link that opens in a new tab when an external URL is configured', () => {
    render(<PortfolioCard {...baseProps} />);
    const link = screen.getByText('Resource Link').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('hides the Resource Link link when no external URL is configured', () => {
    render(<PortfolioCard {...baseProps} externalUrl="" />);
    expect(screen.queryByText('Resource Link')).not.toBeInTheDocument();
  });

  it('navigates to the Study page with affiliated study identifiers when Associated Studies is clicked', () => {
    render(<PortfolioCard {...baseProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Associated Studies' }));
    expect(mockHistoryPush).toHaveBeenCalledWith('/studies?studyIds=STUDY-1%2CSTUDY-2');
  });

  it('renders the program title as a keyboard-focusable link to Program Details', () => {
    render(<PortfolioCard {...baseProps} />);
    const link = screen.getByText('Test Program').closest('a');
    expect(link).toHaveAttribute('href', '/program-details/TP');
    link.focus();
    expect(link).toHaveFocus();
  });

  it('renders the study count as a link to Program Details', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(getCount('2 Associated Studies').closest('a')).toHaveAttribute('href', '/program-details/TP');
  });

  it('disables Associated Studies when the program has no associated studies', () => {
    render(<PortfolioCard {...baseProps} studies={[]} />);
    const button = screen.getByRole('button', { name: 'Associated Studies' });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });

  it('renders the Initiatives card with its fixed heading and the unaffiliated study count', () => {
    render(
      <PortfolioCard
        isInitiatives
        name="Initiatives"
        identifier={null}
        description="Studies not affiliated with a program."
        externalUrl=""
        studies={[{ study_short_name: 'STUDY-3', study_name: 'Study Three' }]}
        image=""
        imageAlt="Initiatives"
      />,
    );
    expect(screen.getByText('Initiatives')).toBeInTheDocument();
    expect(getCount('1 Associated Study')).toBeInTheDocument();
  });

  it('navigates to the no-program Program Details route when the Initiatives title is clicked', () => {
    render(
      <PortfolioCard
        isInitiatives
        name="Initiatives"
        identifier={null}
        description="Studies not affiliated with a program."
        externalUrl=""
        studies={[{ study_short_name: 'STUDY-3', study_name: 'Study Three' }]}
        image=""
        imageAlt="Initiatives"
      />,
    );
    expect(screen.getByText('Initiatives').closest('a')).toHaveAttribute('href', '/program-details');
  });
});
