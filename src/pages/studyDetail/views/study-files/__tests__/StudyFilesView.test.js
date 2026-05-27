import { studyFilesTableConfig } from "../../../../../bento/studyDetailData";
import { formatAssociationValue } from "../StudyFilesView";

/**
 * Mock graphqlClient to prevent Apollo Client initialization errors
 */

jest.mock("../../../../../utils/graphqlClient", () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

describe("StudyFilesView Configuration", () => {
  it("studyFilesTableConfig is properly configured for the view", () => {
    expect(studyFilesTableConfig).toBeDefined();
    expect(studyFilesTableConfig.name).toBe("Study_Files");
    expect(studyFilesTableConfig.dataKey).toBe("data_file_uuid");
  });

  it("has required columns for display", () => {
    const columns = studyFilesTableConfig.columns;
    expect(Array.isArray(columns)).toBe(true);
    expect(columns.length).toBeGreaterThan(0);

    // Verify key columns exist
    const hasCheckbox = columns.some((c) => c.cellType === "CHECKBOX");
    const hasFileName = columns.some((c) => c.dataField === "data_file_name");
    const hasFileType = columns.some((c) => c.dataField === "data_file_type");
    const hasFileSize = columns.some((c) => c.dataField === "data_file_size");

    expect(hasCheckbox).toBe(true);
    expect(hasFileName).toBe(true);
    expect(hasFileType).toBe(true);
    expect(hasFileSize).toBe(true);
  });

  it("has extendedViewConfig for table features", () => {
    expect(studyFilesTableConfig.extendedViewConfig).toBeDefined();
    expect(studyFilesTableConfig.extendedViewConfig.pagination).toBe(true);
    expect(studyFilesTableConfig.extendedViewConfig.download).toBeDefined();
    expect(
      studyFilesTableConfig.extendedViewConfig.download.downloadFileName,
    ).toBe("CTDC_Study_Files");
  });

  it("has selectable rows enabled", () => {
    expect(studyFilesTableConfig.selectableRows).toBe(true);
  });

  it("has proper button configuration", () => {
    expect(studyFilesTableConfig.buttonText).toBe("Add Selected Files");
    expect(studyFilesTableConfig.addFilesRequestVariableKey).toBe(
      "data_file_uuid",
    );
    expect(studyFilesTableConfig.addSelectedFilesQuery).toBeDefined();
  });

  it("has table message for empty state", () => {
    expect(studyFilesTableConfig.tableMsg).toBeDefined();
    expect(studyFilesTableConfig.tableMsg.noMatch).toBe(
      "No study-level files associated with this study.",
    );
  });
});

describe("formatAssociationValue", () => {
  it("joins array values with comma and space", () => {
    const result = formatAssociationValue(["participant", "biospecimen"]);
    expect(result).toBe("participant, biospecimen");
  });

  it("filters empty array values", () => {
    const result = formatAssociationValue([
      "participant",
      "",
      null,
      "biospecimen",
    ]);
    expect(result).toBe("participant, biospecimen");
  });

  it("normalizes comma separated string spacing", () => {
    const result = formatAssociationValue("participant,biospecimen");
    expect(result).toBe("participant, biospecimen");
  });

  it("returns non-string, non-array values as is", () => {
    expect(formatAssociationValue(null)).toBeNull();
    expect(formatAssociationValue(undefined)).toBeUndefined();
  });
});
