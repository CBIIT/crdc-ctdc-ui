import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortfolioCard from './PortfolioCard';

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

describe('PortfolioCard', () => {
  beforeEach(() => {
    mockHistoryPush.mockClear();
  });

  it('renders the program name as a heading', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(screen.getByText('Test Program')).toBeInTheDocument();
  });

  it('renders the study count formatted as "{N} STUDIES"', () => {
    render(<PortfolioCard {...baseProps} />);
    expect(screen.getByText('2 STUDIES')).toBeInTheDocument();
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
    expect(screen.getByText('Associated Studies')).toBeInTheDocument();
  });

  it('renders a Go to site link that opens in a new tab when an external URL is configured', () => {
    render(<PortfolioCard {...baseProps} />);
    const link = screen.getByText('Go to site').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('hides the Go to site link when no external URL is configured', () => {
    render(<PortfolioCard {...baseProps} externalUrl="" />);
    expect(screen.queryByText('Go to site')).not.toBeInTheDocument();
  });

  it('navigates to the Study page with affiliated study identifiers when Associated Studies is clicked', () => {
    render(<PortfolioCard {...baseProps} />);
    fireEvent.click(screen.getByText('Associated Studies'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/studies?studyIds=STUDY-1%2CSTUDY-2');
  });

  it('navigates to the Program Details page when the program title is clicked', () => {
    render(<PortfolioCard {...baseProps} />);
    fireEvent.click(screen.getByText('Test Program'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/program-details/TP');
  });

  it('navigates to the Program Details page when the study count is clicked', () => {
    render(<PortfolioCard {...baseProps} />);
    fireEvent.click(screen.getByText('2 STUDIES'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/program-details/TP');
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
    expect(screen.getByText('1 STUDIES')).toBeInTheDocument();
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
    fireEvent.click(screen.getByText('Initiatives'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/program-details');
  });
});
