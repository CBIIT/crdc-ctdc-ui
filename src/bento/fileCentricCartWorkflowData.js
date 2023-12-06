import gql from 'graphql-tag';
import { cellTypes, dataFormatTypes } from '@bento-core/table';
import { types, btnTypes } from '@bento-core/paginated-table';
import { customMyFilesTabDownloadCSV } from './tableDownloadCSV';

export const navBarCartData = {
  cartLabel: 'Cart',
  cartLink: '/fileCentricCart',
  cartIcon: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/Icon-Cart-Navbar.svg',
  cartIconAlt: 'cart_logo',
};

// --------------- Files limit configuration --------------
export const alertMessage = 'The cart is limited to 1000 files. Please narrow the search criteria or remove some files from the cart to add more.';
export const maximumNumberOfFilesAllowedInTheCart = 1000;

// --------------- Tooltip configuration --------------
export const tooltipContent = {
  icon: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg',
  alt: 'tooltipIcon',
  clsName: 'tooltip_icon',
  myFiles: 'To access and analyze files, select and remove unwanted files, click the "Download File Manifest" button, and upload the resulting manifest file to your Velsera Seven Bridges Cancer Genomics Cloud account.',
  arrow: true,
  styles: {
    border: '#03A383 1px solid',
  },
};

//BENTO-2455 Configuration set for Bento 4.0.
export const myFilesPageData = {
  manifestFileName: 'CTDC File Manifest',
  tooltipIcon: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg',
  tooltipAlt: 'tooltip icon',
  tooltipMessage: 'To access and analyze files: select and remove unwanted files,  click the “Download Manifest” button, and upload the resulting Manifest file to your Seven Bridges Genomics account.',
  errorMessage: 'An error has occurred in loading CART',
  layout: [
    {
      container: 'outer_layout',
      size: 'xl',
      clsName: 'container_outer_layout',
      items: [
        {
          clsName: 'cart_icon',
          type: types.ICON,
          src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/Icon-Cart-Workflow.svg',
          alt: 'Bento MyFiles header logo',
        },
        {
          clsName: 'cart_header_text',
          text: 'Cart >',
          type: types.TEXT,
        },
        {
          clsName: 'cart_sel_files_text',
          text: 'Selected Files',
          type: types.TEXT,
        },
      ],
    },
    {
    container: 'buttons',
    size: 'xl',
    clsName: 'container_header',
    items: [
      {
        title: 'Download File Manifest',
        clsName: 'download_manifest',
        type: types.BUTTON,
        role: btnTypes.DOWNLOAD_MANIFEST,
        btnType: btnTypes.DOWNLOAD_MANIFEST,
        tooltipCofig: tooltipContent
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
    items: [],
  }]
};
 
export const manifestData = {
  keysToInclude: ['data_file_name', 'data_file_uuid', 'subject_id', 'data_file_checksum_value', 'specimen_id', 'snomed_disease_term','primary_disease_site', 'stage_of_disease','tumor_grade', 'age_at_enrollment', 'sex', 'reported_gender', 'race','ethnicity','carcinogen_exposure','targeted_therapy','parent_specimen_id','anatomical_collection_site', 'specimen_type','tissue_category','assessment_timepoint','User_Comment'],
  header: ['name', 'drs_uri', 'Participant ID', 'Md5sum', 'Biospecimen ID', 'Diagnosis','Primary Site', 'Stage of Disease', 'Tumor Grade', 'Age', 'Sex', 'Gender', 'Race', 'Ethnicity', 'Carcinogen Exposure', 'Targeted Therapy', 'Parent Biospecimen ID', 'Anatomical Collection Site','Biospecimen Type','Tissue Category','Collection Timepoint','User Comment'],
};

// --------------- GraphQL query - Retrieve selected cases info --------------
export const GET_MY_CART_DATA_QUERY = gql`
  query filesInList(
    $data_file_uuid: [String],
    $offset: Int = 0,
    $first: Int = 10,
    $order_by:String ="data_file_name",
    $sort_direction:String="asc"
  ){
    filesInList(
      data_file_uuid: $data_file_uuid,
      offset: $offset,
      first: $first,
      order_by: $order_by,
      sort_direction: $sort_direction
    ){ data_file_name
      data_file_format
      data_file_type
      data_file_size
      association
      data_file_description
      subject_id
      primary_disease_site
      specimen_id
      snomed_disease_term
      data_file_uuid
      stage_of_disease
      tumor_grade
      age_at_enrollment
      sex
      reported_gender
      race
      data_file_checksum_value
      ethnicity
      carcinogen_exposure
      targeted_therapy
      anatomical_collection_site
      specimen_type
      tissue_category
      assessment_timepoint
   }
  }
`;
export const GET_MY_CART_DATA_QUERY2 = gql`
query fileOverview(
  $data_file_uuid: [String]
  $offset: Int = 0,
  $first: Int = 10,
  $order_by:String ="data_file_name",
  $sort_direction:String="asc"
){
  fileOverview(
    data_file_uuid: $data_file_uuid
    offset: $offset,
      first: $first,
      order_by: $order_by,
      sort_direction: $sort_direction
  ){
    data_file_name
    data_file_format
    data_file_type
    data_file_size
    association
    data_file_description
    subject_id
    primary_disease_site
    specimen_id
    snomed_disease_term
    data_file_uuid
    stage_of_disease
    tumor_grade
    age_at_enrollment
    sex
    reported_gender
    race
    data_file_checksum_value
    ethnicity
    carcinogen_exposure
    targeted_therapy
    anatomical_collection_site
    specimen_type
    tissue_category
    assessment_timepoint
  }
}`;


export const GET_MY_CART_DATA_QUERY_DESC = gql` query filesInList(
  $data_file_uuid: [String],
  $offset: Int = 0,
  $first: Int = 10,
  $order_by:String ="data_file_name",
  $sort_direction:String="desc"
){
  filesInList(
    data_file_uuid: $data_file_uuid,
    offset: $offset,
    first: $first,
    order_by: $order_by,
    sort_direction: $sort_direction
  ){ data_file_name
    data_file_format
    data_file_type
    data_file_size
    association
    data_file_description
    subject_id
    primary_disease_site
    specimen_id
    snomed_disease_term
    data_file_uuid
    stage_of_disease
    tumor_grade
    age_at_enrollment
    sex
    reported_gender
    race
    data_file_checksum_value
    ethnicity
    carcinogen_exposure
    targeted_therapy
    anatomical_collection_site
    specimen_type
    tissue_category
    assessment_timepoint
 }
}`;

// --------------- File table configuration --------------

export const table = {
  dataField: 'data_file_uuid',
  title: 'myFiles',
  // Value must be one of the 'dataField's in "columns"
  defaultSortField: 'data_file_name',
  // 'asc' or 'desc'
  api: GET_MY_CART_DATA_QUERY,
  defaultSortDirection: 'asc',
  paginationAPIField: 'filesInList',
  paginationAPIFieldDesc: 'filesInList',
  dataKey:'data_file_uuid',
  tableDownloadCSV: customMyFilesTabDownloadCSV,
  objectKey: 'filesInList',
  extendedViewConfig: {
    pagination: true,
    download: {
      customDownload: true,
      fileName: 'CTDC_My_Files_download',
      downloadCsv: 'Download table contents as CSV',
      ...customMyFilesTabDownloadCSV,
    },
    manageViewColumns: {
      title: 'View columns',
    },
  },
  columns: [
    {
      cellType: cellTypes.CHECKBOX,
      display: true,
      role: cellTypes.CHECKBOX,
    },
    {
      dataField: 'data_file_name',
      header: 'File Name',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'data_file_format',
      header: 'Format',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'data_file_type',
      header: 'File Type',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'data_file_size',
      header: 'Size',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'data_file_description',
      header: 'Description',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'specimen_id',
      header: 'Biospecimen ID',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'subject_id',
      header: 'Participant ID',
      display: true,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      cellType: cellTypes.DELETE,
      headerType: cellTypes.DELETE,
      display: true,
    },
  ],
  tableMsg: {
    noMatch: 'No files have been added to the cart',
  },
};

