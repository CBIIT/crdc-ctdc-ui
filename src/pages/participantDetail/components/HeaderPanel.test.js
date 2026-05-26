import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import HeaderPanel from './HeaderPanel';

/**
 * Purpose: Unit tests for the HeaderPanel component on the participant detail page.
 * Validates rendering of participant demographics, diagnosis, and targeted therapy sections,
 * with special focus on the N/A fallback logic for missing or empty values.
 *
 * Reviewed by [Name] on [Date]
 */

jest.mock('../../../components/Breadcrumb/BreadcrumbView', () => {
  const React = require('react');
  return function MockBreadcrumb(props) {
    // Safely serialize data — props.data may contain JSX elements
    let textContent = '';
    try {
      textContent = (props.data || []).map((item) => {
        if (typeof item.name === 'string') return item.name;
        // For JSX name values, extract the participant_id from the breadcrumb entry
        return item.to || 'breadcrumb-item';
      }).join(' > ');
    } catch (e) {
      textContent = 'breadcrumb';
    }
    return React.createElement(
      'div',
      { 'data-testid': 'breadcrumb', 'data-separator': props.separator },
      textContent,
    );
  };
});

jest.mock('../../../bento/participantDetailData', () => ({
  headerIcon: 'mock-header-icon.png',
}));

describe('HeaderPanel', () => {
  let container;

  const classes = {
    breadCrumb: 'breadCrumb',
    header: 'header',
    logo: 'logo',
    headerTitle: 'headerTitle',
    headerMainTitle: 'headerMainTitle',
    headerMainSubTitle: 'headerMainSubTitle',
    infoPanelContainer: 'infoPanelContainer',
    infoPanelSection: 'infoPanelSection',
    infoPanelSectionTitle: 'infoPanelSectionTitle',
    infoPanelRow: 'infoPanelRow',
    infoPanelLabel: 'infoPanelLabel',
    infoPanelValue: 'infoPanelValue',
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  /** Helper: render component into the test container */
  const renderComponent = (participant) => {
    act(() => {
      ReactDOM.render(
        <HeaderPanel classes={classes} participant={participant} />,
        container,
      );
    });
  };

  /** Helper: count occurrences of a substring in container text */
  const countText = (substring) =>
    (container.textContent.match(new RegExp(substring, 'g')) || []).length;

  // ────────────────────────────────────────────────────
  // Breadcrumb rendering
  // ────────────────────────────────────────────────────
  describe('Breadcrumb rendering', () => {
    it('should render a breadcrumb component with the participant id', () => {
      // Arrange
      const participant = {
        participant_id: 'CTDC-001',
        age_at_enrollment: 30,
        race: 'White',
        ethnicity: 'Not Hispanic',
        sex: 'Male',
        primary_diagnosis_disease_group: 'Lymphoma',
        primary_disease_site: 'Chest',
        stage_of_disease: 'Stage II',
        targeted_therapy: 'Drug X',
        best_response_to_targeted_therapy: 'Partial Response',
      };

      // Act
      renderComponent(participant);

      // Assert
      const breadcrumb = container.querySelector('[data-testid="breadcrumb"]');
      expect(breadcrumb).not.toBeNull();
      expect(breadcrumb.getAttribute('data-separator')).toBe('>');
      // The breadcrumb data includes "Explore" as the first entry
      expect(breadcrumb.textContent).toContain('Explore');
    });
  });

  // ────────────────────────────────────────────────────
  // Page header
  // ────────────────────────────────────────────────────
  describe('Page header', () => {
    it('should display the participant id in the header title', () => {
      // Arrange
      const participant = {
        participant_id: 'P-5678',
        age_at_enrollment: null, race: null, ethnicity: null, sex: null,
        primary_diagnosis_disease_group: null, primary_disease_site: null,
        stage_of_disease: null, targeted_therapy: null,
        best_response_to_targeted_therapy: null,
      };

      // Act
      renderComponent(participant);

      // Assert
      const subtitle = container.querySelector('.headerMainSubTitle');
      expect(subtitle).not.toBeNull();
      expect(subtitle.textContent).toBe('P-5678');
    });

    it('should render the header icon image with alt text', () => {
      // Arrange
      const participant = {
        participant_id: 'P-0001',
        age_at_enrollment: 10, race: 'Asian', ethnicity: 'Hispanic', sex: 'Female',
        primary_diagnosis_disease_group: 'Leukemia', primary_disease_site: 'Blood',
        stage_of_disease: 'Stage I', targeted_therapy: 'Drug A',
        best_response_to_targeted_therapy: 'Complete Response',
      };

      // Act
      renderComponent(participant);

      // Assert
      const img = container.querySelector('img[alt="Participant detail header icon"]');
      expect(img).not.toBeNull();
      expect(img.src).toContain('mock-header-icon.png');
    });
  });

  // ────────────────────────────────────────────────────
  // InfoRow N/A fallback logic
  // ────────────────────────────────────────────────────
  describe('InfoRow N/A fallback for missing values', () => {
    it('should show N/A when a field value is null', () => {
      // Arrange
      const participant = {
        participant_id: 'P-NULL',
        age_at_enrollment: null,
        race: 'White',
        ethnicity: null,
        sex: 'Male',
        primary_diagnosis_disease_group: null,
        primary_disease_site: 'Lung',
        stage_of_disease: null,
        targeted_therapy: null,
        best_response_to_targeted_therapy: 'Stable',
      };

      // Act
      renderComponent(participant);

      // Assert – 5 null fields should each render N/A
      expect(countText('N/A')).toBe(5);
    });

    it('should show N/A when a field value is an empty string', () => {
      // Arrange
      const participant = {
        participant_id: 'P-EMPTY',
        age_at_enrollment: '',
        race: '',
        ethnicity: '',
        sex: '',
        primary_diagnosis_disease_group: '',
        primary_disease_site: '',
        stage_of_disease: '',
        targeted_therapy: '',
        best_response_to_targeted_therapy: '',
      };

      // Act
      renderComponent(participant);

      // Assert – all 9 info fields should show N/A
      expect(countText('N/A')).toBe(9);
    });

    it('should show actual values and zero N/A when all fields are populated', () => {
      // Arrange
      const participant = {
        participant_id: 'P-FULL',
        age_at_enrollment: 45,
        race: 'Black',
        ethnicity: 'Not Hispanic',
        sex: 'Female',
        primary_diagnosis_disease_group: 'Sarcoma',
        primary_disease_site: 'Bone',
        stage_of_disease: 'Stage III',
        targeted_therapy: 'Imatinib',
        best_response_to_targeted_therapy: 'Complete Response',
      };

      // Act
      renderComponent(participant);

      // Assert
      expect(countText('N/A')).toBe(0);
      expect(container.textContent).toContain('45');
      expect(container.textContent).toContain('Black');
      expect(container.textContent).toContain('Sarcoma');
      expect(container.textContent).toContain('Imatinib');
      expect(container.textContent).toContain('Complete Response');
    });

    it('should display numeric zero as a valid value, not N/A', () => {
      // Arrange
      const participant = {
        participant_id: 'P-ZERO',
        age_at_enrollment: 0,
        race: 'White',
        ethnicity: 'Hispanic',
        sex: 'Male',
        primary_diagnosis_disease_group: 'CML',
        primary_disease_site: 'Blood',
        stage_of_disease: 'Stage I',
        targeted_therapy: 'Drug B',
        best_response_to_targeted_therapy: 'Partial',
      };

      // Act
      renderComponent(participant);

      // Assert – 0 is a valid value; none should be N/A
      expect(countText('N/A')).toBe(0);
      expect(container.textContent).toContain('0');
    });

    it('should show N/A for a mix of null and empty-string fields', () => {
      // Arrange
      const participant = {
        participant_id: 'P-MIX',
        age_at_enrollment: 12,
        race: '',
        ethnicity: null,
        sex: 'Female',
        primary_diagnosis_disease_group: 'Leukemia',
        primary_disease_site: '',
        stage_of_disease: null,
        targeted_therapy: 'Drug A',
        best_response_to_targeted_therapy: '',
      };

      // Act
      renderComponent(participant);

      // Assert – race(''), ethnicity(null), primary_disease_site(''),
      // stage_of_disease(null), best_response('') = 5 N/A
      expect(countText('N/A')).toBe(5);
    });
  });

  // ────────────────────────────────────────────────────
  // Section titles
  // ────────────────────────────────────────────────────
  describe('Info panel section titles', () => {
    it('should render Demographics, Diagnosis, and Targeted Therapy sections', () => {
      // Arrange
      const participant = {
        participant_id: 'P-SEC',
        age_at_enrollment: 20, race: 'Asian', ethnicity: 'Not Hispanic', sex: 'Female',
        primary_diagnosis_disease_group: 'ALL', primary_disease_site: 'Blood',
        stage_of_disease: 'Stage IV', targeted_therapy: 'Drug C',
        best_response_to_targeted_therapy: 'No Response',
      };

      // Act
      renderComponent(participant);

      // Assert
      const sectionTitles = Array.from(
        container.querySelectorAll('.infoPanelSectionTitle'),
      ).map((el) => el.textContent);
      expect(sectionTitles).toEqual(['Demographics', 'Diagnosis', 'Targeted Therapy']);
    });
  });

  // ────────────────────────────────────────────────────
  // Label rendering
  // ────────────────────────────────────────────────────
  describe('Info panel labels', () => {
    it('should render all expected field labels in order', () => {
      // Arrange
      const participant = {
        participant_id: 'P-LABELS',
        age_at_enrollment: 10, race: 'White', ethnicity: 'Hispanic', sex: 'Male',
        primary_diagnosis_disease_group: 'AML', primary_disease_site: 'Bone Marrow',
        stage_of_disease: 'Stage II', targeted_therapy: 'Drug D',
        best_response_to_targeted_therapy: 'Stable Disease',
      };

      // Act
      renderComponent(participant);

      // Assert
      const expectedLabels = [
        'Age at Enrollment:',
        'Race:',
        'Ethnicity:',
        'Sex:',
        'Primary Diagnosis:',
        'Primary Disease Site:',
        'Stage of Disease:',
        'Targeted Therapy:',
        'Response to Targeted Therapy:',
      ];
      const renderedLabels = Array.from(
        container.querySelectorAll('.infoPanelLabel'),
      ).map((el) => el.textContent);
      expect(renderedLabels).toEqual(expectedLabels);
    });
  });
});
