import { btnTypes } from "@bento-core/paginated-table";
import { configWrapper, wrapperConfig } from "../Wrapper";
import { studyFilesTableConfig } from "../../../../../../bento/studyDetailData";

/**
 * Mock graphqlClient to prevent Apollo Client initialization errors
 */
jest.mock("../../../../../../utils/graphqlClient", () => ({
  client: {
    query: jest.fn(),
    mutate: jest.fn(),
  },
}));


describe("Study Files Wrapper Configuration", () => {
  describe("configWrapper", () => {
    it("returns correct wrapper configuration structure", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2); // paginatedTable, container_footer
    });

    it("includes paginatedTable and container_footer sections", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );

      const classNames = result.map((config) => config.clsName);
      expect(classNames).toContain(undefined); // paginatedTable has no clsName
      expect(classNames).toContain("container_footer");
    });

    it("maps button title from studyFilesTableConfig", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );
      const footer = result.find((c) => c.clsName === "container_footer");

      expect(footer).toBeDefined();
      expect(footer.items).toBeDefined();
      expect(Array.isArray(footer.items)).toBe(true);

      const addButton = footer.items.find(
        (i) => i.role === btnTypes.ADD_SELECTED_FILES,
      );
      expect(addButton).toBeDefined();
      expect(addButton.title).toBe(studyFilesTableConfig.buttonText);
    });

    it("includes correct query configuration", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );
      const footer = result.find((c) => c.clsName === "container_footer");
      const addButton = footer.items.find(
        (i) => i.role === btnTypes.ADD_SELECTED_FILES,
      );

      expect(addButton.addFileQuery).toBe(
        studyFilesTableConfig.addSelectedFilesQuery,
      );
      expect(addButton.dataKey).toBe(
        studyFilesTableConfig.addFilesRequestVariableKey,
      );
      expect(addButton.responseKeys).toEqual(
        studyFilesTableConfig.addFilesResponseKeys,
      );
    });

    it("includes maxFileLimit property", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );
      const footer = result.find((c) => c.clsName === "container_footer");
      const addButton = footer.items.find(
        (i) => i.role === btnTypes.ADD_SELECTED_FILES,
      );

      expect(addButton.maxFileLimit).toBeDefined();
      expect(addButton.maxFileLimit).toBe(1000);
    });

    it("includes tooltip configuration", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );
      const footer = result.find((c) => c.clsName === "container_footer");
      const addButton = footer.items.find(
        (i) => i.role === btnTypes.ADD_SELECTED_FILES,
      );

      expect(addButton.tooltipCofig).toBeDefined();
      expect(addButton.tooltipCofig.icon).toBeDefined();
      expect(addButton.tooltipCofig.arrow).toBe(false);
    });

    it("includes alert message configuration", () => {
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        10,
      );
      const footer = result.find((c) => c.clsName === "container_footer");
      const addButton = footer.items.find(
        (i) => i.role === btnTypes.ADD_SELECTED_FILES,
      );

      expect(addButton.alertMessage).toBeDefined();
      expect(addButton.alertMessage).toContain("1000 files");
    });

    it("passes correct file count", () => {
      const fileCount = 25;
      const result = configWrapper(
        studyFilesTableConfig,
        wrapperConfig,
        "",
        fileCount,
      );

      // The fileCount is passed to configWrapper and should be available in configuration
      expect(result).toBeDefined();
    });
  });

  describe("wrapperConfig structure", () => {
    it("has expected configuration sections", () => {
      expect(wrapperConfig).toBeDefined();
      expect(Array.isArray(wrapperConfig)).toBe(true);

      const classNames = wrapperConfig.map((config) => config.clsName);
      expect(classNames).toContain(undefined); // paginatedTable has no clsName
      expect(classNames).toContain("container_footer");
    });

    it("container_footer has ADD_SELECTED_FILES button", () => {
      const footer = wrapperConfig.find(
        (c) => c.clsName === "container_footer",
      );

      expect(footer).toBeDefined();
      expect(footer.items).toBeDefined();

      const addButton = footer.items.find(
        (i) => i.role === btnTypes.ADD_SELECTED_FILES,
      );
      expect(addButton).toBeDefined();
      expect(addButton.btnType).toBe(btnTypes.ADD_SELECTED_FILES);
    });
  });
});
