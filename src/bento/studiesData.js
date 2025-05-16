import gql from 'graphql-tag';
import {
  cellTypes,
  headerTypes,
} from '../bento-core';
import booksOnAShelfIcon from '../assets/study/books_on_a_shelf.svg';
import fileDrawerIcon from '../assets/study/file_drawer.svg';
import photographIcon from '../assets/study/photograph.svg';
import documentAndPenIcon from '../assets/study/document_and_pen.svg';
import abstractGraphIcon from '../assets/study/abstract_graph.svg';
import clipboardWithChecklist from '../assets/study/clipboard_with_checklist.svg'

export const tableLayOut = [
  {
    container: 'paginatedTable',
    paginatedTable: true,
  },
];

export const pageData = {
  embargoFileIcon: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/icdc/images/svgs/Icon-Embargo-File.svg',
  studyListingIcon: {
    src: clipboardWithChecklist,
    alt: 'Clipboard with checklist',
  },
  externalLinkIcon: {
    src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/ctdc/images/svg/ExternalLinkIcon.svg',
    alt: 'External link icon',
  },
  table: {
    numbOfRowPerPage: 10,
    // Table title
    title: 'Studies',
    // Field name for table data, need to be updated only when using a different GraphQL query
    dataField: 'getAllStudies',
    paginationAPIField: 'getAllStudies',
    // toggle D.A.L unified tooltip above D.A.L icons on table toolbar
    legendTooltip: true,
    defaultSortField: 'study_id',
    defaultSortDirection: 'asc',
    extendedViewConfig: {
      download: {
        customDownload: true,
        // downloaded File Name
        downloadFileName: 'CTDC_Studies_download',
        downloadCsv: 'Download Table Contents As CSV',
        keysToInclude: [
          "study_id",
          "study_name",
          "participant_file_count",
          "study_file_count",
          "image_collection_count",
          "numberOfPublication",
          "image_collection",
          "study_type",
        ],
        header: [
          "Study Code",
          "Study Name",
          "Participant File(s)",
          "Study File(s)",
          "Image Collection(s)",
          "Publication(s)",
          "Additional CRDC Nodes",
          "Study Type",
        ]
      },
      manageViewColumns: {
        title: 'View Columns',
      },
    },
    columns: [
      {
        dataField: 'study_id',
        header: 'Study Code',
        display: true,
        cellType: cellTypes.CUSTOM_ELEM,
        linkAttr: {
          rootPath: '/study',
          pathParams: ['study_id'],
        },
        tooltipText: 'sort',
      },
      {
        dataField: 'study_name',
        header: 'Study Name',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'participant_file_count',
        iconLabel: 'Number of Participant Files',
        header: 'Participant File(s)',
        display: true,
        columnDefaultValues: {
          0: 'Not Applicable',
        },
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        headerType: headerTypes.CUSTOM_ELEM,
        icon: booksOnAShelfIcon,
        iconAlt: 'Books on a shelf',
      },
      {
        dataField: 'study_file_count',
        header: 'Study File(s)',
        display: true,
        columnDefaultValues: {
          0: 'Not Applicable',
        },
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        headerType: headerTypes.CUSTOM_ELEM,
        tooltipText: 'sort',
        icon: fileDrawerIcon,
        iconAlt: 'File drawer',
      },
      {
        dataField: 'image_collection_count',
        header: 'Image Collection(s)',
        display: true,
        columnDefaultValues: {
          0: 'Not Applicable',
        },
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        headerType: headerTypes.CUSTOM_ELEM,
        tooltipText: 'sort',
        icon: photographIcon,
        iconAlt: 'Photograph',
      },
      {
        dataField: 'numberOfPublication', // numberOfPublications
        header: 'Publication(s)',
        display: true,
        columnDefaultValues: {
          0: 'Not Applicable',
        },
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        headerType: headerTypes.CUSTOM_ELEM,
        tooltipText: 'sort',
        icon: documentAndPenIcon,
        iconAlt: 'Document and pen',
      },
      {
        dataField: 'image_collection',
        header: 'Additional CRDC Nodes',
        display: true,
        columnDefaultValues: {
          0: 'Not Applicable',
        },
        role: cellTypes.DISPLAY,
        cellType: cellTypes.CUSTOM_ELEM,
        headerType: headerTypes.CUSTOM_ELEM,
        tooltipText: 'sort',
        icon: abstractGraphIcon,
        iconAlt: 'Abstract graph',
      },
      {
        dataField: 'study_type',
        header: 'Study Type',
        role: cellTypes.DISPLAY,
        display: true,
        tooltipText: 'sort',
      },
      // {
      //   dataField: 'accession_id',
      //   header: 'Accession ID',
      //   display: true,
      //   role: cellTypes.DISPLAY,
      //   tooltipText: 'sort',
      // },
      // {
      //   dataField: 'study_disposition',
      //   header: 'Study Disposition',
      //   display: false,
      //   role: cellTypes.DISPLAY,
      //   tooltipText: 'sort',
      // },
      // {
      //   dataField: 'numberOfCases',
      //   header: 'Cases',
      //   link: '/explore',
      //   display: true,
      //   cellType: cellTypes.CUSTOM_ELEM,
      //   role: cellTypes.DISPLAY,
      //   tooltipText: 'sort',
      // },
    ],
    columnGroups: [
      {
        clsName: 'other_columns_left',
        columnIndexes: [0, 1],
      },
      {
        clsName: 'data_availability',
        custom: true,
        columnIndexes: [2, 6],
      },
      {
        clsName: 'other_columns_right',
        columnIndexes: [7, 8],
      },
    ],
  },
};

export const textLabels = {
  textLabels: {
    toolbar: {
      search: 'Search',
      downloadCsv: 'Download Table Contents As CSV',
      print: 'Print',
      viewColumns: 'View Columns',
      filterTable: 'Filter Table',
    },
  },
};

// --------------- GraphQL query - Retrieve program info --------------
export const GET_STUDY_DATA_QUERY = gql`{
  getAllStudies {
    study_id
    study_name
    study_short_name
    study_description
    study_type
    dates_of_conduct
    participant_count
    participant_file_count
    image_collection_count
    study_file_count

    associated_links {
      associated_link_name
      associated_link_url
      associated_link_id
    }
    image_collection {
      image_collection_name
      repository_name
      image_collection_url
      image_type_included
      collection_access
    }
  }
}`;

export const GET_STUDY_DATA_INTEROPS_QUERY = gql`
query search {
  getInteropData {
    data{
      getAllStudies {
        study_id
        study_short_name
        image_collection_count
        image_collection: associated_links {
          associated_link_name
          associated_link_url
          metadataIDC {
            collection_id
            cancer_type
            date_updated
            doi
            description
            image_types
            location
            species
            subject_count
            supporting_data
          }
          metadataTCIA{
            collection
            aggregate_PatientID
            aggregate_Modality
            aggregate_BodyPartExamined
            aggregate_ImageCount
            aggregate_ImageBool
          }
          }
        }
      }
    }
  }
`;
