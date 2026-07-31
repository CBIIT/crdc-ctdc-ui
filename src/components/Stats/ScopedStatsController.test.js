import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: jest.fn(),
}));

jest.mock("./StatsView", () => ({ data }) => {
  const React = require("react");
  return React.createElement(
    "div",
    { "data-testid": "stats-view" },
    JSON.stringify(data),
  );
});

jest.mock("../../bento/dashboardTabData", () => ({
  defaultFilters: {
    files: { association: ["biospecimen", "participant"] },
    studyFiles: { association: ["study"] },
  },
}));

describe("ScopedStatsController", () => {
  const { useQuery } = require("@apollo/client");
  const ScopedStatsController = require("./ScopedStatsController").default;

  let container;

  const mockData = {
    searchParticipants: {
      numberOfStudies: 1,
      numberOfParticipants: 10,
      numberOfDiagnoses: 5,
      numberOfTargetedTherapies: 3,
      numberOfSpecimens: 20,
      numberOfFiles: 100,
    },
    filesTabCount: { numberOfFiles: 80 },
    studyFilesTabCount: { numberOfStudyFiles: 20 },
  };

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    jest.clearAllMocks();
  });

  describe("Loading and Error States", () => {
    it("shows loading spinner when loading", () => {
      useQuery.mockReturnValue({ loading: true, error: null, data: null });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      expect(container.querySelector('[role="progressbar"]')).toBeTruthy();
    });

    it("shows empty stats bar on error", () => {
      const consoleError = jest.spyOn(console, "error").mockImplementation();
      useQuery.mockReturnValue({
        loading: false,
        error: new Error("Network error"),
        data: null,
      });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      // Should NOT show loading spinner on error
      expect(container.querySelector('[role="progressbar"]')).toBeFalsy();
      // Should render StatsView with empty data (not a loading spinner)
      expect(container.querySelector('[data-testid="stats-view"]')).toBeTruthy();
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to load scoped stats:",
        expect.any(Error),
      );
      consoleError.mockRestore();
    });
  });

  describe("Variable Validation - Filters Invalid Values", () => {
    it.each([
      ["null values", { study_short_name: null }],
      ["undefined values", { study_short_name: undefined }],
      ["empty arrays", { study_short_name: [] }],
      ["arrays with only null", { study_short_name: [null] }],
      ["arrays with only undefined", { study_short_name: [undefined] }],
      ["mixed null/undefined in array", { participant_id: [null, undefined] }],
      ["null object", null],
      ["undefined object", undefined],
      ["empty object", {}],
    ])("skips query when variables contain %s", (_, variables) => {
      useQuery.mockReturnValue({ loading: false, error: null, data: null });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, { variables }),
          container,
        );
      });
      const lastCall = useQuery.mock.calls[useQuery.mock.calls.length - 1];
      expect(lastCall[1].skip).toBe(true);
    });

    it.each([
      [
        "valid study filter",
        { study_short_name: ["COTC007B"] },
        { study_short_name: ["COTC007B"] },
      ],
      [
        "valid participant filter",
        { participant_id: ["P001"] },
        { participant_id: ["P001"] },
      ],
      [
        "multiple valid filters",
        { study_short_name: ["COTC007B"], sex: ["Female"] },
        { study_short_name: ["COTC007B"], sex: ["Female"] },
      ],
      [
        "array with valid and invalid items",
        { study_short_name: ["COTC007B", null, undefined] },
        { study_short_name: ["COTC007B"] },
      ],
      [
        "non-array values",
        { custom_field: "value" },
        { custom_field: "value" },
      ],
    ])("accepts and processes %s", (_, input, expectedFilters) => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, { variables: input }),
          container,
        );
      });
      const lastCall = useQuery.mock.calls[useQuery.mock.calls.length - 1];
      expect(lastCall[1].skip).toBe(false);
      expect(lastCall[1].variables).toMatchObject(expectedFilters);
    });
  });

  describe("Association Filters - Always Included", () => {
    it("always includes association filters in query variables", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      const lastCall = useQuery.mock.calls[useQuery.mock.calls.length - 1];
      expect(lastCall[1].variables).toMatchObject({
        files_association: ["biospecimen", "participant"],
        study_association: ["study"],
      });
    });

    it("merges custom variables with association filters", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: {
              study_short_name: ["COTC007B"],
              participant_id: ["P001"],
            },
          }),
          container,
        );
      });
      const lastCall = useQuery.mock.calls[useQuery.mock.calls.length - 1];
      expect(lastCall[1].variables).toEqual({
        files_association: ["biospecimen", "participant"],
        study_association: ["study"],
        study_short_name: ["COTC007B"],
        participant_id: ["P001"],
      });
    });
  });

  describe("File Count Override Logic", () => {
    it("overrides numberOfFiles with filesTabCount value", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      const statsView = container.querySelector('[data-testid="stats-view"]');
      const renderedData = JSON.parse(statsView.textContent);
      expect(renderedData.numberOfFiles).toBe(80); // from filesTabCount
      expect(renderedData.numberOfStudyFiles).toBe(20); // from studyFilesTabCount
    });

    it("falls back to main query when filesTabCount is missing", () => {
      const dataWithoutFilesTabCount = {
        searchParticipants: { ...mockData.searchParticipants },
        studyFilesTabCount: { numberOfStudyFiles: 20 },
      };
      useQuery.mockReturnValue({
        loading: false,
        error: null,
        data: dataWithoutFilesTabCount,
      });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      const statsView = container.querySelector('[data-testid="stats-view"]');
      const renderedData = JSON.parse(statsView.textContent);
      expect(renderedData.numberOfFiles).toBe(100); // fallback to main query
    });

    it("preserves all other stats from main query", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      const statsView = container.querySelector('[data-testid="stats-view"]');
      const renderedData = JSON.parse(statsView.textContent);
      expect(renderedData).toMatchObject({
        numberOfStudies: 1,
        numberOfParticipants: 10,
        numberOfDiagnoses: 5,
        numberOfTargetedTherapies: 3,
        numberOfSpecimens: 20,
      });
    });
  });

  describe("Query Skip Logic", () => {
    it("does not skip when valid filters are provided", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { study_short_name: ["COTC007B"] },
          }),
          container,
        );
      });
      const lastCall = useQuery.mock.calls[useQuery.mock.calls.length - 1];
      expect(lastCall[1].skip).toBe(false);
    });

    it("skips query when only association filters would be present", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: null });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, { variables: {} }),
          container,
        );
      });
      const lastCall = useQuery.mock.calls[useQuery.mock.calls.length - 1];
      expect(lastCall[1].skip).toBe(true);
    });
  });

  describe("Integration with StatsView", () => {
    it("passes processed statsData to StatsView", () => {
      useQuery.mockReturnValue({ loading: false, error: null, data: mockData });
      act(() => {
        ReactDOM.render(
          React.createElement(ScopedStatsController, {
            variables: { participant_id: ["P001"] },
          }),
          container,
        );
      });
      const statsView = container.querySelector('[data-testid="stats-view"]');
      expect(statsView).toBeTruthy();
      const renderedData = JSON.parse(statsView.textContent);
      expect(renderedData).toMatchObject({
        numberOfStudies: 1,
        numberOfParticipants: 10,
        numberOfFiles: 80, // overridden
        numberOfStudyFiles: 20, // overridden
      });
    });
  });
});
