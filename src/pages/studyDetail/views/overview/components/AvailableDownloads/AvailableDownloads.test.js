/**
 * Test suite for AvailableDownloads component
 * Tests dynamic filtering logic based on participantFileTypes(StudyDataFileByStudyShortName.list_type) and zipFileData
 */

import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import AvailableDownloads from "./AvailableDownloads";

// Mock Material-UI withStyles
jest.mock("@material-ui/core", () => ({
  Grid: ({ children, item, container, ...props }) => (
    <div {...props}>{children}</div>
  ),
  withStyles: () => (Component) => (props) => (
    <Component {...props} classes={{}} />
  ),
}));

// Mock ZipDownloadView component
jest.mock("./ZipDownloadView", () => {
  return ({ buttonText, disabled }) => (
    <div
      data-testid="zip-download-view"
      data-button-text={buttonText}
      data-disabled={disabled}
    >
      {buttonText} {disabled ? "(disabled)" : "(enabled)"}
    </div>
  );
});

describe("AvailableDownloads Component", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  // Helper function to render component
  const renderComponent = (participantFileTypes = [], zipFileData = []) => {
    act(() => {
      ReactDOM.render(
        <AvailableDownloads
          participantFileTypes={participantFileTypes}
          zipFileData={zipFileData}
        />,
        container,
      );
    });
  };

  // Helper to create zip file data
  const createZipData = (
    dataFileType,
    uuid = "valid-uuid",
    name = "file.zip",
  ) => {
    const zipFile = { data_file_name: name, data_file_format: "zip" };
    // Only add uuid if it's not undefined (null and "" are intentionally included)
    if (uuid !== undefined) {
      zipFile.data_file_uuid = uuid;
    }
    return {
      data_file_type: dataFileType,
      zip_files: [zipFile],
    };
  };

  // Helper to get buttons
  const getButtons = () =>
    container.querySelectorAll('[data-testid="zip-download-view"]');
  const getButtonTexts = () =>
    Array.from(getButtons()).map((btn) => btn.textContent);

  // ========================================
  // Basic Rendering Tests
  // ========================================
  describe("Basic rendering", () => {
    it("should render all three configured buttons when all types match", () => {
      const types = [
        "Variant Call File",
        "Variant Report",
        "Radiology Imaging",
      ];
      const zipData = types.map((type) => createZipData(type, `uuid-${type}`));

      renderComponent(types, zipData);

      expect(getButtons().length).toBe(3);
      expect(container.textContent).toContain("Variant Call Files");
      expect(container.textContent).toContain("Variant Reports");
      expect(container.textContent).toContain("Radiology Images");
      expect(container.textContent).toContain("AVAILABLE DOWNLOADS");
    });

    it("should render only matching buttons", () => {
      renderComponent(["Variant Report"], [createZipData("Variant Report")]);

      expect(getButtons().length).toBe(1);
      expect(container.textContent).toContain("Variant Reports");
      expect(container.textContent).not.toContain("Variant Call Files");
    });

    it("should preserve button order (configured types first)", () => {
      const types = [
        "Radiology Imaging",
        "Variant Report",
        "Variant Call File",
      ];
      const zipData = types.map((type) => createZipData(type));

      renderComponent(types, zipData);

      const buttons = Array.from(getButtons()).map((btn) =>
        btn.getAttribute("data-button-text"),
      );
      expect(buttons[0]).toBe("Variant Call Files");
      expect(buttons[1]).toBe("Variant Reports");
      expect(buttons[2]).toBe("Radiology Images");
    });
  });

  // ========================================
  // Empty State Tests - Parameterized
  // ========================================
  describe("Empty states", () => {
    test.each([
      ["no megazip files", ["Variant Report"], []],
      [
        "empty zip_files array",
        ["Variant Report"],
        [{ data_file_type: "Variant Report", zip_files: [] }],
      ],
      [
        "null zip_files",
        ["Variant Report"],
        [{ data_file_type: "Variant Report", zip_files: null }],
      ],
      [
        "undefined zip_files",
        ["Variant Report"],
        [{ data_file_type: "Variant Report" }],
      ],
      ["no participantFileTypes", [], [createZipData("Variant Report")]],
      ["both empty", [], []],
      ["missing props", undefined, undefined],
      ["type mismatch", ["Clinical Data"], [createZipData("Variant Report")]],
    ])("should hide section when %s", (_, types, zipData) => {
      renderComponent(types, zipData);
      expect(container.textContent).toBe("");
    });
  });

  // ========================================
  // Validation Tests - Parameterized
  // ========================================
  describe("UUID validation", () => {
    test.each([
      ["null", null],
      ["empty string", ""],
    ])("should hide section when data_file_uuid is %s", (_, uuid) => {
      renderComponent(
        ["Variant Report"],
        [createZipData("Variant Report", uuid)],
      );
      expect(container.textContent).toBe("");
    });

    it("should hide section when data_file_uuid is undefined", () => {
      renderComponent(
        ["Variant Report"],
        [
          {
            data_file_type: "Variant Report",
            zip_files: [
              {
                // data_file_uuid is undefined (not present)
                data_file_name: "reports.zip",
                data_file_format: "zip",
              },
            ],
          },
        ],
      );
      expect(container.textContent).toBe("");
    });

    it("should render button when data_file_uuid is valid", () => {
      renderComponent(
        ["Variant Report"],
        [createZipData("Variant Report", "valid-uuid")],
      );

      expect(getButtons().length).toBe(1);
      expect(container.textContent).toContain("Variant Reports");
    });

    it("should filter out invalid entries and show only valid ones", () => {
      const zipData = [
        createZipData("Variant Report", null),
        createZipData("Variant Call File", "uuid-1"),
        createZipData("Radiology Imaging", ""),
      ];

      renderComponent(
        ["Variant Report", "Variant Call File", "Radiology Imaging"],
        zipData,
      );

      expect(getButtons().length).toBe(1);
      expect(container.textContent).toContain("Variant Call Files");
      expect(container.textContent).not.toContain("Variant Reports");
      expect(container.textContent).not.toContain("Radiology Images");
    });
  });

  // ========================================
  // Hybrid Approach - Dynamic Types
  // ========================================
  describe("Dynamic file types (unconfigured)", () => {
    it("should render button for unconfigured file type", () => {
      renderComponent(["Genomic Data"], [createZipData("Genomic Data")]);

      expect(getButtons().length).toBe(1);
      expect(container.textContent).toContain("Genomic Data");
    });

    it("should render both configured and unconfigured types", () => {
      const zipData = [
        createZipData("Variant Report", "uuid-1"),
        createZipData("Genomic Data", "uuid-2"),
        createZipData("Clinical Data", "uuid-3"),
      ];

      renderComponent(
        ["Variant Report", "Genomic Data", "Clinical Data"],
        zipData,
      );

      expect(getButtons().length).toBe(3);
      expect(container.textContent).toContain("Variant Reports");
      expect(container.textContent).toContain("Genomic Data");
      expect(container.textContent).toContain("Clinical Data");
    });

    it("should not render unconfigured type if UUID is invalid", () => {
      renderComponent(["Genomic Data"], [createZipData("Genomic Data", null)]);

      expect(container.textContent).toBe("");
    });

    it("should prioritize configured types before dynamic types", () => {
      const zipData = [
        createZipData("Genomic Data", "uuid-1"),
        createZipData("Variant Report", "uuid-2"),
        createZipData("Clinical Data", "uuid-3"),
      ];

      renderComponent(
        ["Genomic Data", "Variant Report", "Clinical Data"],
        zipData,
      );

      const texts = getButtonTexts();
      const variantIdx = texts.findIndex((t) => t.includes("Variant Reports"));
      const genomicIdx = texts.findIndex((t) => t.includes("Genomic Data"));
      const clinicalIdx = texts.findIndex((t) => t.includes("Clinical Data"));

      expect(variantIdx).toBeLessThan(genomicIdx);
      expect(variantIdx).toBeLessThan(clinicalIdx);
    });
  });

  // ========================================
  // Edge Cases
  // ========================================
  describe("Edge cases", () => {
    it("should handle multiple zip files for same type", () => {
      renderComponent(
        ["Variant Report"],
        [
          {
            data_file_type: "Variant Report",
            zip_files: [
              { data_file_uuid: "uuid-1", data_file_name: "part1.zip" },
              { data_file_uuid: "uuid-2", data_file_name: "part2.zip" },
            ],
          },
        ],
      );

      expect(getButtons().length).toBe(1);
      expect(container.textContent).toContain("Variant Reports");
    });

    it("should be case-sensitive for file type matching", () => {
      renderComponent(["variant report"], [createZipData("Variant Report")]);

      expect(container.textContent).toBe("");
    });

    it("should show title and description when buttons exist", () => {
      renderComponent(["Variant Report"], [createZipData("Variant Report")]);

      expect(container.textContent).toContain("AVAILABLE DOWNLOADS");
      expect(container.textContent).toContain(
        "Subject to the appropriate access controls",
      );
    });

    it("should not show title when no buttons exist", () => {
      renderComponent([], []);
      expect(container.textContent).not.toContain("AVAILABLE DOWNLOADS");
    });

    it("should render only matching button when partial match exists", () => {
      renderComponent(
        ["Variant Call File", "Clinical Data", "Lab Results"],
        [createZipData("Variant Call File")],
      );

      expect(getButtons().length).toBe(1);
      expect(container.textContent).toContain("Variant Call Files");
    });
  });
});
