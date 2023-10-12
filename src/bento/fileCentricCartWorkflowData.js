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
  myFiles: 'To access and analyze files: select and remove unwanted files,  click the “Download Manifest” button, and upload the resulting Manifest file to your Seven Bridges Genomics account.',
  arrow: true,
  styles: {
    border: '#03A383 1px solid',
  },
};

//BENTO-2455 Configuration set for Bento 4.0.
export const myFilesPageData = {
  manifestFileName: 'BENTO File Manifest',
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
        title: 'DOWNLOAD MANIFEST',
        clsName: 'download_manifest',
        type: types.BUTTON,
        role: btnTypes.DOWNLOAD_MANIFEST,
        btnType: btnTypes.DOWNLOAD_MANIFEST,
        tooltipCofig: tooltipContent,
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
        clsName: 'manifest_comments',
        type: types.TEXT_INPUT,
        placeholder: 'Please add a description for the CSV file you are about to download.',
      }],
  }]
};


export const manifestData = {
  keysToInclude: ['study_code', 'subject_id', 'file_name', 'file_id', 'md5sum'],
  header: ['Study Code', 'Case ID', 'File Name', 'File ID', 'Md5sum', 'User Comments'],
};

// --------------- GraphQL query - Retrieve selected cases info --------------
export const GET_MY_CART_DATA_QUERY = gql`
query filesInList($uuids: [String], $offset: Int = 0, $first: Int = 10, $order_by:String =""){
  filesInList(uuids: $uuids, offset: $offset,first: $first, order_by: $order_by){
    file_name
    drs_uri
    study_code
    case_id
    file_type
    association
    file_description
    file_format
    file_size
    case_id
    file_uuid
    individual_id
    breed
    diagnosis
    study_code
    sample_id
    sample_site
    physical_sample_type
    general_sample_pathology
    tumor_sample_origin
    summarized_sample_type
    specific_sample_pathology
    date_of_sample_collection
    tumor_grade
    sample_chronology
    percentage_tumor
    necropsy_sample
    sample_preservation
    comment
    patient_age_at_enrollment
    sex
    neutered_indicator
    weight
    weight_unit
    primary_disease_site
    stage_of_disease
    date_of_diagnosis
    histology_cytopathology
    histological_grade
    best_response
    pathology_report
    treatment_data
    follow_up_data
    concurrent_disease
    concurrent_disease_type
    arm
    other_cases
    cohort_description
 }
}`;

// --------------- File table configuration --------------

export const table = {
  dataField: 'filesInList',
  // Value must be one of the 'dataField's in "columns"
  defaultSortField: 'file_name',
  // 'asc' or 'desc'
  api: GET_MY_CART_DATA_QUERY,
  defaultSortDirection: 'asc',
  paginationAPIField: 'filesInList',
  tableDownloadCSV: customMyFilesTabDownloadCSV,
  columns: [
    {
      dataField: 'file_name',
      header: 'File Name',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'file_type',
      header: 'File Type',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'association',
      header: 'Association',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'file_description',
      header: 'Description',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'file_format',
      header: 'Format',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'file_size',
      header: 'Size',
      // set formatBytes to true to display file size (in bytes) in a more human readable format
      display: true,
      dataFormatType: dataFormatTypes.FORMAT_BYTES,
      cellType: cellTypes.FORMAT_DATA,
      tooltipText: 'sort',
    },
    {
      dataField: 'subject_id',
      header: 'Case ID',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'study_code',
      header: 'Study Code',
      display: true,
      tooltipText: 'sort',
    },
    {
      dataField: 'file_id',
      header: 'UUID',
      display: false,
      tooltipText: 'sort',
    },
    {
      dataField: 'md5sum',
      header: 'Md5Sum',
      display: false,
      tooltipText: 'sort',
    },
    {
      cellType: cellTypes.DELETE,
      headerType: cellTypes.DELETE,
      display: true,
    },
  ],
  tableMsg: {
    noMatch: 'No Matching Records Found',
  },
};

