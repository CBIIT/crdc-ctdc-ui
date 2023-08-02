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
    name: 'Home',
    link: '/home',
    id: 'navbar-link-home',
    className: 'navMobileItem',
  },
  {
    name: 'Explore',
    link: '/explore',
    id: 'navbar-link-explore',
    className: 'navMobileItem',
  },
  {
    name: 'Trials',
    link: '/trial/NCT04314401',
    id: 'navbar-link-trials',
    className: 'navMobileItem',
  },
  {
    name: 'Data',
    link: '',
    id: 'navbar-dropdown-about',
    className: 'navMobileItem clickable',
  },
  {
    name: 'Resources',
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
    name: 'Request Acess',
    link: '/request-access',
    id: 'navbar-link-request-access',
    className: 'navMobileItem',
  },
];

export const navbarSublists = {
  // Example of how to do a navMobileSubTitle and subtext
  // Home: [
  //   {
  //     name: 'Explore ##',
  //     link: '',
  //     text: 'testText',
  //     id: 'navbar-dropdown-item-navbar-subitem-2',
  //     className: 'navMobileSubTitle',
  //   },
  // ],
  "Data": [
    {
      name: 'Analyze Data',
      link: '/crdc',
      id: 'navbar-dropdown-item-analyze-data',
      className: 'navMobileSubItem',
    },
    {
      name: 'CTDC Data Model',
      link: '/ctdc-data-model',
      id: 'navbar-dropdown-item-CTDC-data-model',
      className: 'navMobileSubItem',
    },
    {
      name: 'CTDC Data Dictionary',
      link: '/data-dictionary',
      id: 'navbar-dropdown-item-CTDC-data-dictionary',
      className: 'navMobileSubItem',
    },
    {
      name: 'Data Use Policy',
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
    "Resources": [
    {
      name: 'GraphQL',
      link: '/graphql',
      id: 'navbar-dropdown-item-graphql',
      className: 'navMobileSubItem',
    },
    {
      name: 'Developers',
      link: '/developers',
      id: 'navbar-dropdown-item-developers',
      className: 'navMobileSubItem',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/CBIIT/bento-ctdc-frontend',
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
