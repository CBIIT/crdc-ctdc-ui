/**
 * Mock graphqlClient to prevent Apollo Client initialization errors
 */
jest.mock("../../utils/graphqlClient", () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));

import {
  studyFilesTableConfig,
  studyFilesTooltipContent,
  STUDY_FILES_BUTTON_TOOLTIP,
} from "../studyDetailData";
import { cellTypes } from "@bento-core/table";

describe("studyFilesTableConfig", () => {
  it("is defined and has correct structure", () => {
    expect(studyFilesTableConfig).toBeDefined();
    expect(typeof studyFilesTableConfig).toBe("object");
  });

  it("has correct name property", () => {
    expect(studyFilesTableConfig.name).toBe("Study_Files");
  });

  it("has correct dataKey property", () => {
    expect(studyFilesTableConfig.dataKey).toBe("data_file_uuid");
  });

  it("has correct buttonText property", () => {
    expect(studyFilesTableConfig.buttonText).toBe("Add Selected Files");
  });

  it("has correct addFilesRequestVariableKey", () => {
    expect(studyFilesTableConfig.addFilesRequestVariableKey).toBe(
      "data_file_uuid",
    );
  });

  it("has correct addFilesResponseKeys", () => {
    expect(studyFilesTableConfig.addFilesResponseKeys).toBeDefined();
    expect(Array.isArray(studyFilesTableConfig.addFilesResponseKeys)).toBe(
      true,
    );
    expect(studyFilesTableConfig.addFilesResponseKeys).toEqual([
      "fileOverview",
      "data_file_uuid",
    ]);
  });

  it("has addSelectedFilesQuery defined", () => {
    expect(studyFilesTableConfig.addSelectedFilesQuery).toBeDefined();
  });

  it("has tableMsg with noMatch message", () => {
    expect(studyFilesTableConfig.tableMsg).toBeDefined();
    expect(studyFilesTableConfig.tableMsg.noMatch).toBe(
      "No study-level files associated with this study.",
    );
  });

  it("has selectableRows set to true", () => {
    expect(studyFilesTableConfig.selectableRows).toBe(true);
  });

  it("has extendedViewConfig defined", () => {
    expect(studyFilesTableConfig.extendedViewConfig).toBeDefined();
    expect(studyFilesTableConfig.extendedViewConfig.pagination).toBe(true);
    expect(
      studyFilesTableConfig.extendedViewConfig.manageViewColumns,
    ).toBeDefined();
    expect(studyFilesTableConfig.extendedViewConfig.download).toBeDefined();
  });

  it("has columns array defined", () => {
    expect(studyFilesTableConfig.columns).toBeDefined();
    expect(Array.isArray(studyFilesTableConfig.columns)).toBe(true);
    expect(studyFilesTableConfig.columns.length).toBeGreaterThan(0);
  });
});

describe("studyFilesTableConfig columns", () => {
  it("includes checkbox column", () => {
    const checkboxCol = studyFilesTableConfig.columns.find(
      (c) => c.cellType === cellTypes.CHECKBOX,
    );
    expect(checkboxCol).toBeDefined();
    expect(checkboxCol.role).toBe(cellTypes.CHECKBOX);
    expect(checkboxCol.display).toBe(true);
  });

  it("includes required data columns", () => {
    const requiredFields = [
      "data_file_name",
      "data_file_type",
      "data_file_format",
      "data_file_size",
    ];

    requiredFields.forEach((field) => {
      const col = studyFilesTableConfig.columns.find(
        (c) => c.dataField === field,
      );
      expect(col).toBeDefined();
      expect(col.header).toBeDefined();
      expect(col.display).toBe(true);
    });
  });

  it("includes description column", () => {
    const descriptionCol = studyFilesTableConfig.columns.find(
      (c) => c.dataField === "data_file_description",
    );
    expect(descriptionCol).toBeDefined();
    expect(descriptionCol.header).toBe("Description");
  });

  it("configures file size column with format", () => {
    const sizeCol = studyFilesTableConfig.columns.find(
      (c) => c.dataField === "data_file_size",
    );
    expect(sizeCol).toBeDefined();
    expect(sizeCol.cellType).toBe(cellTypes.FORMAT_DATA);
    expect(sizeCol.dataFormatType).toBeDefined();
  });

  it("configures access column with download document", () => {
    const accessCol = studyFilesTableConfig.columns.find(
      (c) => c.header === "Access",
    );
    expect(accessCol).toBeDefined();
    expect(accessCol.downloadDocument).toBe(true);
    expect(accessCol.documentDownloadProps).toBeDefined();
    expect(accessCol.documentDownloadProps.maxFileSize).toBe(80000000);
  });

  it("has correct document download configuration", () => {
    const accessCol = studyFilesTableConfig.columns.find(
      (c) => c.header === "Access",
    );
    const props = accessCol.documentDownloadProps;

    expect(props.fileSizeColumn).toBe("data_file_size");
    expect(props.fileLocationColumn).toBe("data_file_uuid");
    expect(props.fileFormatColumn).toBe("data_file_format");
    expect(props.fileName).toBe("data_file_name");
    expect(props.toolTipTextFileDownload).toBeDefined();
    expect(props.iconFileDownload).toBeDefined();
  });
});

// Note: studyFilesConfig and studyFilesColumns backward compatibility exports
// were not created, so those tests are removed

describe("studyFilesTooltipContent", () => {
  it("has correct structure", () => {
    expect(studyFilesTooltipContent).toBeDefined();
    expect(studyFilesTooltipContent.icon).toBeDefined();
    expect(studyFilesTooltipContent.alt).toBe("tooltipIcon");
    expect(studyFilesTooltipContent.arrow).toBe(false);
  });

  it("has Study Files tooltip text", () => {
    expect(studyFilesTooltipContent["Study_Files"]).toBe(
      STUDY_FILES_BUTTON_TOOLTIP,
    );
    expect(studyFilesTooltipContent["Study_Files"]).toBe(
      "Add selected file(s) to cart",
    );
  });

  it("icon URL is valid", () => {
    expect(studyFilesTooltipContent.icon).toContain("https://");
    expect(studyFilesTooltipContent.icon).toContain("material-design-icons");
  });
});

describe("Configuration consistency", () => {
  it("dataKey matches addFilesRequestVariableKey", () => {
    expect(studyFilesTableConfig.dataKey).toBe(
      studyFilesTableConfig.addFilesRequestVariableKey,
    );
  });

  it("response keys include dataKey", () => {
    expect(studyFilesTableConfig.addFilesResponseKeys).toContain(
      studyFilesTableConfig.dataKey,
    );
  });

  it("columns dataKey matches main dataKey", () => {
    // The Access column uses the same UUID field
    const accessCol = studyFilesTableConfig.columns.find(
      (c) => c.header === "Access",
    );
    expect(accessCol.dataField).toBe(studyFilesTableConfig.dataKey);
  });
});
