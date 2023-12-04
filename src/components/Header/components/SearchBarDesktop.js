import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from "react-router-dom";
import clearIcon from '../../../assets/header/Clear_Icon.svg';

import { useSelector } from 'react-redux';
import { queryAutocompleteAPI, SEARCH_DATAFIELDS, SEARCH_KEYS } from '../../../bento/search';
import { PUBLIC_ACCESS } from '../../../bento/siteWideConfig';
import { accessLevelTypes } from '@bento-core/authentication';
import { SearchBarGenerator } from '@bento-core/global-search';
import {CUSTOM_STYLES} from './searchBarStyle';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';


const SearchBarContainer = styled.div`
    display: flex;
    // width: 504px;
    // border: 1px solid black;

    // .searchBar {
    //   margin-left: auto;
    //   width: 224px;
    //   height: 32px;
    //   border: 1px solid #71767A;
    // }

    // .searchButton {
    //   height: 32px;
    //   font-family: Open Sans;
    //   font-weight: 700;
    //   font-size: 1rem;
    //   line-height: 33px;
    //   text-align: center;
    //   color: #FFFFFF;
    //   background: #007BBD;
    //   padding: 0 13px;
    //   border-radius: 0px 5px 5px 0px;
    // }

    // .searchButton:hover {
    //   cursor: pointer;
    //   background: #004971;
    // }

    // input:focus-visible{
    //   outline:none;
    //   border: 3px solid #5786FF;
    // }
`;

const SearchInput = styled.input`
  margin: -1px 0 0 -1px;
  padding: 0 7px;
  border: none;
  font-family: Open Sans;
  font-weight: 400;
  font-size: 1rem;
  line-height: 42px;
  color: #1b1b1b;
  width: 224px;
  height: 32px;
  background: transparent;

  input[type="search"]::-webkit-search-cancel-button {
    position: relative;
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    background: url(${clearIcon}) right center no-repeat;
    background-image: url(${clearIcon}) red;
    background-size: 20px;
    cursor: pointer;
  }

  input[type="search"]:focus::-webkit-search-cancel-button {
    position: relative;
    -webkit-appearance: none;
    height: 20px;
    width: 20px;
    background: url(${clearIcon}) right center no-repeat;
    background-image: url(${clearIcon}) red;
    background-size: 20px;
    cursor: pointer;
  }
`;

const SearchBar = (props) => {
  const location = useLocation();

  const isSignedIn = useSelector((state) => state && state.login.isSignedIn);
  const isAdmin = useSelector((state) => state.login && state.login.role && state.login.role === 'admin');
  const hasApprovedArms = useSelector((state) => state.login.acl
    && state.login.acl.some((arm) => arm.accessStatus === 'approved'));
  const authenticated = PUBLIC_ACCESS === accessLevelTypes.METADATA_ONLY
    || (isSignedIn && (hasApprovedArms || isAdmin));

  const SearchBarConfig = {
    classes: CUSTOM_STYLES(),
    config: {
      placeholder: "Search CTDC",
      query: async (search) => queryAutocompleteAPI(search, !authenticated),
      searchKeys: authenticated ? SEARCH_KEYS.private : SEARCH_KEYS.public,
      searchFields: authenticated ? SEARCH_DATAFIELDS.private : SEARCH_DATAFIELDS.public,
      showSearchButton: true,
      displaySearchIcon: false,
    },
  };
  const { SearchBar } = SearchBarGenerator(SearchBarConfig);
  
  return (
    <SearchBarContainer>
      {!location.pathname.match('/search') && <SearchBar />}
    </SearchBarContainer>
  );
};

export default SearchBar;
