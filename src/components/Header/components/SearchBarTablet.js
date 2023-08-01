import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import clearIcon from '../../../assets/header/Clear_Icon.svg';
import searchIcon from '../../../assets/header/Search_Small_Icon.svg';

const SearchBarContainer = styled.div`
    display: flex;

    .searchBar {
      margin-left: auto;
      width: 303px;
      height: 43px;
      border: 1px solid #71767A;
    }

    .searchButton {
      height: 43px;
      font-family: Open Sans;
      font-weight: 700;
      font-size: 1rem;
      line-height: 33px;
      text-align: center;
      color: #FFFFFF;
      background: #007BBD;
      padding: 10px 14px;
      border-radius: 0px 5px 5px 0px;
    }

    .searchButton:hover {
      cursor: pointer;
      background: #004971;
    }
`;

const SearchInput = styled.input`
  margin: -1px 0 0 -1px;
  padding: 0 7px;
  border: none;
  font-family: Open Sans;
  font-weight: 400;
  font-size: 1.27rem;
  line-height: 47px;
  color: #1b1b1b;
  width: 303px;
  height: 43px;
  background: transparent;

  ::placeholder {
    color: #004A8B;
  }

  :focus {
    outline: 0.25rem solid #2491ff;
  }

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

const SearchBar = () => {
  const history = useHistory();
  const [localText, setLocalText] = useState("");

  const handleTextInputChange = (event) => {
    const text = event.target.value;
    setLocalText(text);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      history.push(`/sitesearch/${localText.trim()}`);
      setLocalText("");
    }
  };

  const handleSearch = () => {
    history.push(`/sitesearch/${localText.trim()}`);
    setLocalText("");
  };

  return (
    <SearchBarContainer>
      <div className="searchBar">
        <label>
          <SearchInput id="header-search-bar" type="search" value={localText} placeholder="" onChange={handleTextInputChange} onKeyDown={handleKeyPress} />
        </label>
      </div>
      <div role="button" tabIndex={0} className="searchButton" onKeyDown={handleKeyPress} onClick={handleSearch}><img src={searchIcon} alt="searchIcon" /></div>
    </SearchBarContainer>
  );
};

export default SearchBar;
