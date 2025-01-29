import gql from 'graphql-tag';
import { cellTypes, dataFormatTypes } from '@bento-core/table';
import { types } from '@bento-core/paginated-table';
import { customMyFilesTabDownloadCSV } from './tableDownloadCSV';
import cartPageIcon from '../assets/cart/cartPageIcon.svg'

export const getManifestFileSignedUrlEndPoint = 'get-manifest-file-signed-url'
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

export const myFilesPageData = {
  manifestFileName: 'CTDC File Manifest',
  tooltipIcon: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg',
  tooltipAlt: 'tooltip icon',
  tooltipMessage: 'To access and analyze files: select and remove unwanted files,  click the “Download Manifest” button, and upload the resulting Manifest file to your Seven Bridges Genomics account.',
  errorMessage: 'An error has occurred in loading CART',
  layout: [
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
          placeholder: 'User Comment',
        }
      ],
    },
  ],

  downButtonText: 'DOWNLOAD MANIFEST',
  headerIconSrc: cartPageIcon,
  headerIconAlt: 'CTDC Cart header logo',
};
 
export const manifestData = {
  keysToInclude: [
    'data_file_name',   // ('name' - 1/4 required fields)
    'drs_uri',          // ('drs_uri' - 2/4 required fields)
    'study_short_name', // ('study_short_name' - 3/4 required fields)
    'subject_id',       // ('participant_id' - 4/4 required fields)

    'data_file_uuid',
    'data_file_checksum_value',
    'parent_specimen_id',
    'ctep_disease_term',
    'meddra_disease_code',
    'primary_disease_site',
    'histology',
    'stage_of_disease',
    'tumor_grade',
    'age_at_enrollment',
    'sex',
    'race',
    'ethnicity',
    'carcinogen_exposure',
    'targeted_therapy',
    'parent_specimen_id',
    'anatomical_collection_site',
    'tissue_category',
    'assessment_timepoint',
    // 'User_Comment'
  ],
  header: [
    'name',
    'drs_uri',
    'study_short_name',
    'participant_id',

    'File ID',
    'Md5sum',
    'Biospecimen ID',
    'Diagnosis',
    'MedDRA Disease Code',
    'Primary Site',
    'Histology',
    'Stage of Disease',
    'Tumor Grade',
    'Age',
    'Sex',
    'Race',
    'Ethnicity',
    'Carcinogen Exposure',
    'Targeted Therapy',
    'Parent Biospecimen ID',
    'Anatomical Collection Site',
    'Tissue Category',
    'Collection Timepoint',
    'User Comment'
  ],
};

// --------------- GraphQL query --------------
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
    ){
      study_short_name
      data_file_name
      data_file_format
      data_file_type
      data_file_size
      association
      ctep_disease_term
      meddra_disease_code
      histology
      data_file_description
      subject_id
      primary_disease_site
      specimen_id
      ctep_disease_term
      data_file_uuid
      parent_specimen_id
      stage_of_disease
      tumor_grade
      age_at_enrollment
      sex
      race
      data_file_checksum_value
      ethnicity
      carcinogen_exposure
      targeted_therapy
      anatomical_collection_site
      tissue_category
      assessment_timepoint
      drs_uri
   }
  }
`;

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
  ){
    study_short_name
    data_file_name
    data_file_format
    data_file_type
    data_file_size
    association
    data_file_description
    subject_id
    ctep_disease_term
    meddra_disease_code
    histology
    parent_specimen_id
    primary_disease_site
    specimen_id
    ctep_disease_term
    data_file_uuid
    stage_of_disease
    tumor_grade
    age_at_enrollment
    sex
    race
    data_file_checksum_value
    ethnicity
    carcinogen_exposure
    targeted_therapy
    anatomical_collection_site
    tissue_category
    assessment_timepoint
    drs_uri
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
    manageViewColumns: false, //{ title: "View Columns" },
    download: false,
    
    /*{
      downloadCsv: "Download Table Contents As CSV",
      downloadFileName: "CTDC_My_Files_download",
      // customDownload: true,
      // ...customMyFilesTabDownloadCSV,
    }, */
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
      dataFormatType: dataFormatTypes.FORMAT_BYTES,
      cellType: cellTypes.FORMAT_DATA,
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
      display: false,
      tooltipText: 'sort',
      role: cellTypes.DISPLAY,
    },
    {
      dataField: 'parent_specimen_id',
      header: 'Parent Biospecimen ID',
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

