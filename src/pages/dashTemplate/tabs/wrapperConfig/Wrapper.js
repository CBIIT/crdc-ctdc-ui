import {
  btnTypes,
  types,
} from '@bento-core/paginated-table';
import {
  tooltipContent, tooltipContentAllFile
} from '../../../../bento/dashboardTabData';
import { alertMessage } from '../../../../bento/fileCentricCartWorkflowData';
import { DisplayCustomText } from '../Customize/TableView';
import CustomGoToCartLink from '../tableConfig/CustomGoToCartLink';

export const layoutConfig = [{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_header',
  items: [
  ],
}];

/**
* Configuration display component based on index
* CAUTION: provide position of table component
*/
export const wrapperConfig = [{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_header',
  items: [
    {
      title: 'ADD ALL FILES',
      clsName: 'add_all_button',
      type: types.BUTTON,
      role: btnTypes.ADD_ALL_FILES,
      btnType: btnTypes.ADD_ALL_FILES,
      tooltipCofig: tooltipContentAllFile,
      conditional: true,
      alertMessage,
    },
    {
      title: 'ADD SELECTED FILES',
      clsName: 'add_selected_button',
      type: types.BUTTON,
      role: btnTypes.ADD_SELECTED_FILES,
      btnType: btnTypes.ADD_SELECTED_FILES,
      tooltipCofig: tooltipContent,
      conditional: true,
      applyActiveFilter: true,
    }],
},
{
  container: 'paginatedTable',
  paginatedTable: true,
},
{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_footer',
  items: [
    {
      title: 'ADD ALL FILES',
      clsName: 'add_all_button',
      type: types.BUTTON,
      role: btnTypes.ADD_ALL_FILES,
      btnType: btnTypes.ADD_ALL_FILES,
      tooltipCofig: tooltipContentAllFile,
      conditional: false,
      alertMessage,
    },
    {
      title: 'ADD SELECTED FILES',
      clsName: 'add_selected_button',
      type: types.BUTTON,
      role: btnTypes.ADD_SELECTED_FILES,
      btnType: btnTypes.ADD_SELECTED_FILES,
      tooltipCofig: tooltipContent,
      conditional: true,
      applyActiveFilter: true,
    },
  ],
},
{
  container: 'buttons',
  size: 'xl',
  clsName: 'container_footer_link',
  items: [
    {
      clsName: 'go_to_cart',
      url: '#/fileCentricCart',
      type: types.CUSTOM_ELEM,
      customViewElem: CustomGoToCartLink,
    }],
},
];

/**
* Return title that will be displayed in wrapper buttons
*/
const getButtonTitle = (tab, item) => {
  if (item.role === btnTypes.ADD_ALL_FILES && tab.addAllButtonText) {
    return tab.addAllButtonText;
  } if (item.role === btnTypes.ADD_SELECTED_FILES && tab.buttonText) {
    return tab.buttonText;
  }

  return item.title;
};

/**
* 1. title - The title that will be displayed on the button
* 2. addFileQuery - query to addAll files or add selected files on cart
* 3. dataKey - A key used to identify the data variable associated with the add files request.
* 4. responseKeys - provided respose key for addFileQuery
* 5. DisplayCustomText - A function that generates custom text for the confirmation message or dialog.
*/
export const configWrapper = (tab, wrapperConfig, context, totalRowCount) => {
  const wrpConfig = wrapperConfig.map((container) => ({
    ...container,
    items: (!container.paginatedTable) ? container.items.map((item) => ({
      ...item,
      title: getButtonTitle(tab, item),
      addFileQuery: (item.role === btnTypes.ADD_ALL_FILES)
        ? tab.addAllFileQuery : tab.addSelectedFilesQuery,
      dataKey: tab.addFilesRequestVariableKey,
      responseKeys: (item.role === btnTypes.ADD_ALL_FILES)
        ? tab.addAllFilesResponseKeys : tab.addFilesResponseKeys,
      DisplayCustomText: {component: (props) => DisplayCustomText({ tab, ...props, totalRowCount }),
        actions:[
          { label: 'No', className:'noBtn', type:'Negative' },
          { label: 'Yes', className:'yesBtn', type:'Positive' },
        ],
      },
    })) : [],
  }));
  return wrpConfig;
};
