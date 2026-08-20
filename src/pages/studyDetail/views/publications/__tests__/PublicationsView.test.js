import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import {
  publicationsTableConfig,
  GET_STUDY_PUBLICATIONS_QUERY,
} from "../../../../../bento/studyDetailData";

jest.mock("../../../../../utils/graphqlClient", () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));

jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useQuery: jest.fn(),
}));

jest.mock("@material-ui/core", () => ({
  withStyles: () => (Component) => {
    const WrappedComponent = (props) => {
      const { createElement } = require("react");
      return createElement(Component, { ...props, classes: {} });
    };
    return WrappedComponent;
  },
}));

describe("publicationsTableConfig", () => {
  it("is defined", () => {
    expect(publicationsTableConfig).toBeDefined();
  });

  it("has the correct empty state message", () => {
    expect(publicationsTableConfig.tableMsg.noMatch).toBe(
      "There are no publications available for this study."
    );
  });

  it("has the correct name", () => {
    expect(publicationsTableConfig.name).toBe("Publications");
  });
});

describe("GET_STUDY_PUBLICATIONS_QUERY", () => {
  it("is defined", () => {
    expect(GET_STUDY_PUBLICATIONS_QUERY).toBeDefined();
  });

  it("requests all required publication fields", () => {
    const queryStr = GET_STUDY_PUBLICATIONS_QUERY.loc.source.body;
    expect(queryStr).toContain("publication_title");
    expect(queryStr).toContain("authorship");
    expect(queryStr).toContain("year_of_publication");
    expect(queryStr).toContain("journal_citation");
    expect(queryStr).toContain("digital_object_id");
    expect(queryStr).toContain("pubmed_id");
  });

  it("uses the publicationInfo query", () => {
    const queryStr = GET_STUDY_PUBLICATIONS_QUERY.loc.source.body;
    expect(queryStr).toContain("publicationInfo");
  });
});

describe("PublicationsView rendering", () => {
  const { useQuery } = require("@apollo/client");
  const PublicationsView = require("../PublicationsView").default;

  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    jest.clearAllMocks();
  });

  it("shows loading state", () => {
    useQuery.mockReturnValue({ loading: true, error: null, data: null });
    act(() => {
      ReactDOM.render(React.createElement(PublicationsView, { study_id: "NCT00980460" }), container);
    });
    expect(container.textContent).toMatch(/loading publications/i);
  });

  it("shows empty state message on error", () => {
    useQuery.mockReturnValue({
      loading: false,
      error: new Error("FieldUndefined"),
      data: null,
    });
    act(() => {
      ReactDOM.render(React.createElement(PublicationsView, { study_id: "NCT00980460" }), container);
    });
    expect(container.textContent).toContain(
      "There are no publications available for this study."
    );
  });

  it("shows empty state message when no publications returned", () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: { publicationInfo: [] },
    });
    act(() => {
      ReactDOM.render(React.createElement(PublicationsView, { study_id: "NCT00980460" }), container);
    });
    expect(container.textContent).toContain(
      "There are no publications available for this study."
    );
  });

  it("shows empty state when all publication fields are null", () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        publicationInfo: [
          {
            publication_title: null,
            authorship: null,
            year_of_publication: null,
            journal_citation: null,
            digital_object_id: null,
            pubmed_id: null,
          },
        ],
      },
    });
    act(() => {
      ReactDOM.render(React.createElement(PublicationsView, { study_id: "NCT00980460" }), container);
    });
    expect(container.textContent).toContain(
      "There are no publications available for this study."
    );
  });

  it("renders publication card when data is available", () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        publicationInfo: [
          {
            publication_title: "Test Publication Title",
            authorship: "Test Author",
            year_of_publication: "2024",
            journal_citation: "Test Journal 1(1):1-10",
            digital_object_id: "10.1000/test",
            pubmed_id: "12345678",
          },
        ],
      },
    });
    act(() => {
      ReactDOM.render(React.createElement(PublicationsView, { study_id: "NCT00980460" }), container);
    });
    expect(container.textContent).toContain("Test Publication Title");
    expect(container.textContent).toContain("Test Author");
    expect(container.textContent).toContain("2024");
  });

  it("renders two publications when data has multiple entries", () => {
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        publicationInfo: [
          {
            publication_title: "First Publication",
            authorship: "Author One",
            year_of_publication: "2023",
            journal_citation: "Journal A",
            digital_object_id: "10.1000/first",
            pubmed_id: "11111111",
          },
          {
            publication_title: "Second Publication",
            authorship: "Author Two",
            year_of_publication: "2024",
            journal_citation: "Journal B",
            digital_object_id: "10.1000/second",
            pubmed_id: "22222222",
          },
        ],
      },
    });
    act(() => {
      ReactDOM.render(React.createElement(PublicationsView, { study_id: "NCT00980460" }), container);
    });
    expect(container.textContent).toContain("First Publication");
    expect(container.textContent).toContain("Second Publication");
  });
});
