import Logo from '../assets/header/Portal_Logo.svg';
import LogoSmall from '../assets/header/Portal_Logo_Small.svg';
import searchbarIcon from '../assets/header/Search_Icon.svg';
import usaFlagSmall from '../assets/header/us_flag_small.svg';

// globalHeaderLogo image 468x100
// globalHeaderImage: image 2200x100
export const headerData = {
  globalHeaderLogo: Logo,
  globalHeaderLogoSmall: LogoSmall,
  globalHeaderLogoLink: '/',
  globalHeaderLogoAltText: 'Portal Logo',
  globalHeaderSearchIcon: searchbarIcon,
  globalHeaderSearchIconAltText: 'search Icon',
  usaFlagSmall,
  usaFlagSmallAltText: 'usaFlagSmall',
};

export const navMobileList = [
  {
    name: 'Explore',
    link: '/explore',
    id: 'navbar-link-explore',
    className: 'navMobileItem',
  },
  {
    name: 'Studies',
    link: '/study/NCT04314401',
    id: 'navbar-link-study',
    className: 'navMobileItem',
  },
  {
    name: 'Data',
    link: '',
    id: 'navbar-dropdown-about',
    className: 'navMobileItem clickable',
  },
  {
    name: 'For Developers',
    link: '',
    id: 'navbar-dropdown-about',
    className: 'navMobileItem clickable',
  },
  {
    name: 'About',
    link: '',
    id: 'navbar-dropdown-about',
    className: 'navMobileItem clickable',
  },
  {
    name: 'Request Access',
    link: '/request-access',
    id: 'navbar-link-request-access',
    className: 'navMobileItem',
  },
];

export const navbarSublists = {
  // Example of how to do a navMobileSubTitle and subtext
  "Data": [
    {
      name: 'Cloud Computing',
      link: '/cloud-computing',
      id: 'navbar-dropdown-item-data-harmonization',
      className: 'navMobileSubItem',
    },
    {
      name: 'Data Model',
      link: '/data-model',
      id: 'navbar-dropdown-item-CTDC-data-model',
      className: 'navMobileSubItem',
    },
    {
      name: 'Data Harmonization',
      link: '/data-harmonization',
      id: 'navbar-dropdown-item-data-harmonization',
      className: 'navMobileSubItem',
    },
    {
      name: 'Data Terms of Use',
      link: '/data-use',
      id: 'navbar-dropdown-item-data-use',
      className: 'navMobileSubItem',
    },
    {
      name: 'Data Submission',
      link: '/submit',
      id: 'navbar-dropdown-item-data-submission',
      className: 'navMobileSubItem',
    },
  ],
    "For Developers": [
    {
      name: 'GraphQL',
      link: '/graphql',
      id: 'navbar-dropdown-item-graphql',
      className: 'navMobileSubItem',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/CBIIT/crdc-ctdc-starter-kit',
      id: 'navbar-dropdown-item-developers',
      className: 'navMobileSubItem',
    },
    {
      name: 'Additional Information',
      link: '/additional-information',
      id: 'navbar-dropdown-item-developers',
      className: 'navMobileSubItem',
    },
  ],
  About: [
    {
      name: 'Purpose',
      link: '/purpose',
      id: 'navbar-dropdown-item-purpose',
      className: 'navMobileSubItem',
    },
    {
      name: 'Contact Us',
      link: '/support',
      id: 'navbar-dropdown-item-contact-us',
      className: 'navMobileSubItem',
    },
  ],
};
