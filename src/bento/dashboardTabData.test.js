jest.mock("../utils/graphqlClient", () => ({
  client: { query: jest.fn(), mutate: jest.fn() },
}));

import { tabContainers, tabs } from "./dashboardTabData";

describe("Study Files tab configuration", () => {
  const studyFilesTab = tabs.find((t) => t.id === "study_file_tab");
  const studyFilesContainer = tabContainers.find(
    (t) => t.id === "study_file_tab",
  );

  describe("tabs entry", () => {
    it("should exist in the tabs array", () => {
      expect(studyFilesTab).toBeDefined();
    });

    it("should have correct title", () => {
      expect(studyFilesTab.title).toBe("Study Files");
    });

    it("should reference numberOfStudyFiles for count", () => {
      expect(studyFilesTab.count).toBe("numberOfStudyFiles");
    });
  });

  describe("tabContainers entry", () => {
    it("should exist in the tabContainers array", () => {
      expect(studyFilesContainer).toBeDefined();
    });

    it("should use fileOverview as paginationAPIField", () => {
      expect(studyFilesContainer.paginationAPIField).toBe("fileOverview");
    });

    it("should use data_file_uuid as dataKey", () => {
      expect(studyFilesContainer.dataKey).toBe("data_file_uuid");
    });

    it("should have selectableRows enabled", () => {
      expect(studyFilesContainer.selectableRows).toBe(true);
    });

    it("should have View Columns enabled in extendedViewConfig", () => {
      expect(
        studyFilesContainer.extendedViewConfig.manageViewColumns,
      ).toBeDefined();
      expect(
        studyFilesContainer.extendedViewConfig.manageViewColumns.title,
      ).toBe("View Columns");
    });

    it("should have CSV download configured", () => {
      expect(
        studyFilesContainer.extendedViewConfig.download.downloadFileName,
      ).toBe("CTDC_Study_Files_download");
    });
  });

  describe("defaultFilters", () => {
    it("should have association filter with study only", () => {
      expect(studyFilesContainer.defaultFilters).toEqual({
        association: ["study"],
      });
    });

    it("should have association array with exactly 1 value", () => {
      expect(studyFilesContainer.defaultFilters.association).toHaveLength(1);
    });

    it("should include study in association filter", () => {
      expect(studyFilesContainer.defaultFilters.association).toContain("study");
    });
  });

  describe("columns", () => {
    const columns = studyFilesContainer.columns;

    it("should have a checkbox column", () => {
      const checkbox = columns.find((c) => c.cellType === "CHECKBOX");
      expect(checkbox).toBeDefined();
    });

    it("should have File Name, File Type, Format, Size, Description columns displayed", () => {
      const expectedFields = [
        "data_file_name",
        "data_file_type",
        "data_file_format",
        "data_file_size",
        "data_file_description",
      ];
      expectedFields.forEach((field) => {
        const col = columns.find((c) => c.dataField === field);
        expect(col).toBeDefined();
        expect(col.display).toBe(true);
      });
    });

    it("should have Access column with unique dataField", () => {
      const accessCol = columns.find((c) => c.header === "Access");
      expect(accessCol).toBeDefined();
      expect(accessCol.dataField).toBe("access");
      expect(accessCol.downloadDocument).toBe(true);
    });

    it("Access column should reference data_file_uuid via documentDownloadProps", () => {
      const accessCol = columns.find((c) => c.header === "Access");
      expect(accessCol.documentDownloadProps.fileLocationColumn).toBe(
        "data_file_uuid",
      );
    });

    it("should have Study Accession column linked to study detail", () => {
      const col = columns.find((c) => c.dataField === "study_accession");
      expect(col).toBeDefined();
      expect(col.display).toBe(true);
      expect(col.linkAttr.rootPath).toBe("/study");
    });

    it("should have File UUID column hidden by default but toggleable", () => {
      const uuidCol = columns.find((c) => c.header === "File UUID");
      expect(uuidCol).toBeDefined();
      expect(uuidCol.dataField).toBe("data_file_uuid");
      expect(uuidCol.display).toBe(false);
      expect(uuidCol.hiddenByDefault).toBe(true);
    });

    it("Access and File UUID columns should have different dataFields", () => {
      const accessCol = columns.find((c) => c.header === "Access");
      const uuidCol = columns.find((c) => c.header === "File UUID");
      expect(accessCol.dataField).not.toBe(uuidCol.dataField);
    });
  });

  describe("cart configuration", () => {
    it("should use data_file_uuid as addFilesRequestVariableKey", () => {
      expect(studyFilesContainer.addFilesRequestVariableKey).toBe(
        "data_file_uuid",
      );
    });

    it("should have correct addFilesResponseKeys", () => {
      expect(studyFilesContainer.addFilesResponseKeys).toEqual([
        "fileOverview",
        "data_file_uuid",
      ]);
    });

    it("should have correct addAllFilesResponseKeys", () => {
      expect(studyFilesContainer.addAllFilesResponseKeys).toEqual([
        "fileOverview",
        "data_file_uuid",
      ]);
    });
  });
});

describe("Files tab configuration", () => {
  const filesTab = tabs.find((t) => t.id === "file_tab");
  const filesContainer = tabContainers.find((t) => t.id === "file_tab");

  describe("tabs entry", () => {
    it("should exist in the tabs array", () => {
      expect(filesTab).toBeDefined();
    });

    it("should reference numberOfFiles for count", () => {
      expect(filesTab.count).toBe("numberOfFiles");
    });
  });

  describe("tabContainers entry", () => {
    it("should exist in the tabContainers array", () => {
      expect(filesContainer).toBeDefined();
    });

    it("should use fileOverview as paginationAPIField", () => {
      expect(filesContainer.paginationAPIField).toBe("fileOverview");
    });
  });

  describe("defaultFilters", () => {
    it("should have association filter with biospecimen and participant", () => {
      expect(filesContainer.defaultFilters).toEqual({
        association: ["biospecimen", "participant"],
      });
    });

    it("should have association array with exactly 2 values", () => {
      expect(filesContainer.defaultFilters.association).toHaveLength(2);
    });

    it("should include biospecimen in association filter", () => {
      expect(filesContainer.defaultFilters.association).toContain(
        "biospecimen",
      );
    });

    it("should include participant in association filter", () => {
      expect(filesContainer.defaultFilters.association).toContain(
        "participant",
      );
    });
  });
});

describe("defaultFilters comparison between tabs", () => {
  const filesContainer = tabContainers.find((t) => t.id === "file_tab");
  const studyFilesContainer = tabContainers.find(
    (t) => t.id === "study_file_tab",
  );

  it("both tabs should use fileOverview API with different association filters", () => {
    expect(filesContainer.paginationAPIField).toBe("fileOverview");
    expect(studyFilesContainer.paginationAPIField).toBe("fileOverview");
    expect(filesContainer.defaultFilters.association).not.toEqual(
      studyFilesContainer.defaultFilters.association,
    );
  });

  it("Files tab should filter by biospecimen and participant associations", () => {
    expect(filesContainer.defaultFilters).toEqual({
      association: ["biospecimen", "participant"],
    });
  });

  it("Study Files tab should filter by study association only", () => {
    expect(studyFilesContainer.defaultFilters).toEqual({
      association: ["study"],
    });
  });

  it("association filters should be mutually exclusive", () => {
    const filesAssociations = filesContainer.defaultFilters.association;
    const studyFilesAssociations =
      studyFilesContainer.defaultFilters.association;
    const overlap = filesAssociations.filter((value) =>
      studyFilesAssociations.includes(value),
    );
    expect(overlap).toHaveLength(0);
  });
});
