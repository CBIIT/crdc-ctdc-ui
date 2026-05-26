import { btnTypes, types } from "@bento-core/paginated-table";
import { studyFilesTooltipContent } from "../../../../../bento/studyDetailData";
import {
  alertMessage,
  maximumNumberOfFilesAllowedInTheCart,
} from "../../../../../bento/fileCentricCartWorkflowData";

export const wrapperConfig = [
  {
    container: "buttons",
    size: "xl",
    clsName: "container_header",
    items: [],
  },
  {
    container: "paginatedTable",
    paginatedTable: true,
  },
  {
    container: "buttons",
    size: "xl",
    clsName: "container_footer",
    items: [
      {
        title: "ADD SELECTED FILES",
        clsName: "add_selected_button",
        type: types.BUTTON,
        role: btnTypes.ADD_SELECTED_FILES,
        btnType: btnTypes.ADD_SELECTED_FILES,
        tooltipCofig: studyFilesTooltipContent,
        conditional: true,
        alertMessage,
        maxFileLimit: maximumNumberOfFilesAllowedInTheCart,
      },
    ],
  },
];

/**
 * Return title that will be displayed in wrapper buttons
 */
const getButtonTitle = (tab, item) => {
  if (item.role === btnTypes.ADD_SELECTED_FILES && tab.buttonText) {
    return tab.buttonText;
  }
  return item.title;
};

/**
 * Configure wrapper for study files
 */
export const configWrapper = (tab, wrapperConfig, context, totalRowCount) => {
  const wrpConfig = wrapperConfig.map((container) => ({
    ...container,
    items: !container.paginatedTable
      ? container.items.map((item) => ({
          ...item,
          title: getButtonTitle(tab, item),
          addFileQuery: tab.addSelectedFilesQuery,
          dataKey: tab.addFilesRequestVariableKey,
          responseKeys: tab.addFilesResponseKeys,
        }))
      : [],
  }));
  return wrpConfig;
};
