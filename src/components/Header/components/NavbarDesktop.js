/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { useGlobal } from '../../Global/GlobalProvider';
import { useAuth } from '../../Authentication';
import CartContainer from '../../Cart/CartContainer';
import { navMobileList, navbarSublists } from '../../../config/globalHeaderData';


const Nav = styled.div`
    top: 0;
    left: 0;
    width: 100%;
    background: #ffffff;
    z-index: 1100;
    position: relative;
    box-shadow: ${({ location }) =>
      location.pathname === '/home' ? '-0.1px 6px 9px -6px rgba(0, 0, 0, 0.5)' : 'none'};

    .dropdownContainer {
      // outline: none;
      // visibility: hidden;
      // opacity: 0;
      margin: 0 auto;
      position: relative;
      width: 1800px;
    }
    .invisible {
      visibility: hidden;
    }
 `;

const NavContainer = styled.div`
    max-height: 53px;
    height: 53px;
    margin: 0 auto;
    max-width: 1800px;
    text-align: left;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: end;
`;

const UlContainer = styled.ul`
  list-style: none;
  margin: 0;
  padding-top: 0;
  padding-left: 11px;
`;

const LiSection = styled.li`
  display: inline-block;
  position: relative;
  line-height: 50px;
  letter-spacing: 1px;
  text-align: center;
  transition:all 0.3s ease-in-out;

  a {
    color: #565c65;
    text-decoration: none;
  }

  .navTitle {
    display: block;
    color: #565c65;
    font-family: Poppins;
    font-size: 17px;
    font-weight: 600;
    line-height: 17px;
    letter-spacing: normal;
    text-decoration: none;
    padding: 16px 16px 0px 16px;
    user-select:none;
    border-top: 4px solid transparent;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .navTitle:hover {
    cursor: pointer;
  }

  .navText {
    padding-bottom: 12px;
    border-bottom: 4px solid transparent;
  }

  .navText:hover {
    cursor: pointer;
    color: #3A75BD;
    border-bottom: 4px solid #3A75BD;

    ::after {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-bottom: 1px solid #298085;
      border-left: 1px solid #298085;
      margin: 0 0 4px 8px;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
    }
  }

  .navText::after {
    content: "";
    display: inline-block;
    width: 6px;
    height: 6px;
    border-bottom: 1px solid #565c65;
    border-left: 1px solid #565c65;
    margin: 0 0 4px 8px;
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
  }

  .clicked {
    color: #FFFFFF;
    background: #1F4671;
  }

  .clicked::after {
    border-top: 1px solid #FFFFFF;
    border-right: 1px solid #FFFFFF;
    border-bottom: 0;
    border-left: 0;
    margin: 0 0 0 8px
  }

  .clicked:hover {
    border-bottom: 4px solid #1F4671;
    color: #FFFFFF;

    ::after {
      content: "";
      display: inline-block;
      width: 6px;
      height: 6px;
      border-top: 1px solid #FFFFFF;
      border-right: 1px solid #FFFFFF;
      border-bottom: 0;
      border-left: 0;
      margin: 0 0 0 8px;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
    }
  }

  .directLink::after {
    display: none;
  }

  .directLink:hover {
    ::after {
      display: none;
    }
  }
  .shouldBeUnderlined {
    border-bottom: 4px solid #3A75BD;
  }
  .navTitleClicked {
    display: block;
    color: #FFFFFF;
    font-family: Poppins;
    font-size: 17px;
    font-weight: 600;
    line-height: 17px;
    letter-spacing: normal;
    text-decoration: none;
    padding: 16px 16px 0px 16px;

    user-select:none;
    background: #1F4671;
    border-top: 4px solid #5786FF;
    border-left: 4px solid #5786FF;
    border-right: 4px solid #5786FF;
  }
`;

const Dropdown = styled.div`
    left: 0;
    width: 100%;
    background: #1F4671;
    z-index: 1100;
    position: absolute;
    // top: 69px;
    // visibility: hidden;
    // outline: none;
    // opacity: 0;
`;

const DropdownContainer = styled.div`
    margin: 0 auto;
    text-align: left;
    position: relative;
    max-width: 1800px;

    .dropdownList {
      background: #1F4671;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 32px 32px 0 32px;
      flex-wrap: wrap;
    }

    .dropdownItem {
      padding: 0 35px 35px 35px;
      text-align: left;
      font-family: 'Poppins';
      font-weight: 600;
      font-style: normal;
      font-size: 20px;
      line-height: 110%;
      width: max-content;
      color: #FFFFFF;
      text-decoration: none;
  }
  .dropdownItem:nth-child(4n-3) {
    padding: 0 35px 35px 0px;
  }

  .dropdownItem:hover {
    text-decoration: underline;
  }

  .dropdownItemText {
    margin-top: 5px;
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
  }
`;

const StyledLoginLink = styled(Link)`
  color: #00846A;
  font-size: 14px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.42px;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px 0 10px 0;
  margin-bottom: 4.5px;
  margin-right: -1px;
`;

const CartSpan = styled.span`
    display: flex;
    flex-flow: row;
    align-items: flex-end;
    margin-right: 10px;

    .userName{
      color: #00846A;
      font-size: 16px;
      font-family: Poppins;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: 0.42px;
      text-decoration: none;
      padding: 19px 0 10px 0;
      margin-bottom: 4.5px;
      margin-right: -1px;
      cursor: pointer;
    }
    `

const NameDropdown = styled.div`
    top: 60.5px;
    left: 0;
    width: 100%;
    background: #1F4671;
    z-index: 2200;
    position: absolute;

`;


const NameDropdownContainer = styled.div`
  margin: 0 auto;
  text-align: left;
  position: relative;
  max-width: 1800px;
  .dropdownList {
      background: #1F4671;
      display: inline-flex;
      grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
      padding: 32px 32px 0 32px;
  }
  .dropdownItem {
    padding: 0 10px 52px 10px;
    text-align: left;
    font-family: 'Poppins';
    font-weight: 600;
    font-style: normal;
    font-size: 20px;
    line-height: 110%;
    color: #FFFFFF;
    text-decoration: none;
    cursor: pointer;
  }

  .dropdownItem:hover {
    text-decoration: underline;
  }
  .dropdownItemButton {
    padding-bottom: 0;
    text-transform: none;
  }
  .dropdownItemButton:hover {
    background: transparent;
  }
  #navbar-dropdown-item-name-logout {
    max-width: 200px;
  }
`;


const useOutsideAlerter = (ref1, ref2) => {
  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target ||
         (event.target.getAttribute("class") !== "dropdownList" 
            && ref1.current && !ref1.current.contains(event.target)
               && ref2.current && !ref2.current.contains(event.target))) {
        let toggle = document.getElementsByClassName("navText clicked");
        if (toggle[0] && !event.target.getAttribute("class").includes("navText clicked")) {
          let temp = toggle[0];
          temp.click();
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref1, ref2]);
};

const NavBar = () => {
  const authData = useSelector((state) => {
    console.log(state);
    return state.login;
  } );

  const {
    signOut,
  } = useAuth();
  const history = useHistory();
  const [clickedTitle, setClickedTitle] = useState("");
  const dropdownSelection = useRef(null);
  const nameDropdownSelection = useRef(null);
  const clickableObject = navMobileList.filter((item) => item.className === 'navMobileItem clickable');
  const clickableTitle = clickableObject.map((item) => item.name);
  const displayName = authData.name || "N/A";
  const [isSignedIn, setIsSignedIn] = useState(authData.name?authData.isSignedIn:false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  clickableTitle.push(displayName);

  useOutsideAlerter(dropdownSelection, nameDropdownSelection);

  const handleMenuClick = (e) => {
    if (e.target.innerText === clickedTitle || !clickableTitle.includes(e.target.innerText)) {
      setClickedTitle("");
    } else {
      setClickedTitle(e.target.innerText);
    }
  };

  const onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      handleMenuClick(e);
    }
  };

  const { Notification } = useGlobal();
  const onShowNotification = (content, duration) => Notification.show(content, duration);

  const handleLogout = async () => {
    setClickedTitle("");
    signOut(history, "/", 'DCF');
    onShowNotification("You have been logged out.", 2000)
    history.push('/');
  };

  function shouldBeUnderlined(item) {
    const linkName = item.name;
    const correctPath = window.location.href.slice(window.location.href.lastIndexOf(window.location.host) + window.location.host.length);
    const correctLink = "/#".concat(item.link);
    if (item.className === "navMobileItem") {
      return correctPath === correctLink;
    }
    if (navbarSublists[linkName] === undefined) {
      return false;
    }
    const linkNames = Object.values(navbarSublists[linkName]).map((e) => "/#".concat(e.link));
    return linkNames.includes(correctPath);
  }


  useEffect(() => {
    setClickedTitle("");
  }, []);

  const EnhancedNav = withRouter(Nav);

  return (
    <EnhancedNav>
      <NavContainer>
        <UlContainer>
          {
            navMobileList.map((navMobileItem, idx) => {
              const navkey = `nav_${idx}`;
              return (
                navMobileItem.className === 'navMobileItem'
                  ? (
                    <LiSection key={navkey}>
                      <div className="navTitle directLink">
                        <NavLink replace to={navMobileItem.link} target={navMobileItem.link.startsWith("https://") ? "_blank" : "_self"}>
                          <div
                            id={navMobileItem.id}
                            onKeyDown={onKeyPressHandler}
                            role="button"
                            tabIndex={0}
                            className={`navText directLink ${shouldBeUnderlined(navMobileItem) ? "shouldBeUnderlined" : ""}`}
                            onClick={handleMenuClick}
                          >
                            {navMobileItem.name}
                          </div>
                        </NavLink>
                      </div>
                    </LiSection>
                  )
                  : (
                    <LiSection key={navkey}>
                      <div className={clickedTitle === navMobileItem.name ? 'navTitleClicked' : 'navTitle'}>
                        <div
                          id={navMobileItem.id}
                          onKeyDown={onKeyPressHandler}
                          role="button"
                          tabIndex={0}
                          className={`${clickedTitle === navMobileItem.name ? 'navText clicked' : 'navText'} ${shouldBeUnderlined(navMobileItem) ? "shouldBeUnderlined" : ""}`}
                          onClick={handleMenuClick}
                        >
                          {navMobileItem.name}
                        </div>
                      </div>
                    </LiSection>
                  )
              );
            })
          }
        </UlContainer>
 {isSignedIn && authData.name
            ? (
               <CartSpan>
               <div
                    id="navbar-dropdown-name"
                    onKeyDown={onKeyPressHandler}
                    role="button"
                    tabIndex={0} className={clickedTitle === displayName ? 'navText displayName clicked userName' : 'navText displayName userName' }
                    onClick={handleMenuClick}
                  >
                    {displayName}
                  </div>
                <CartContainer />
              </CartSpan> 
              ):(
         <CartSpan>
         <StyledLoginLink  id="header-navbar-login-button" to="/user/login">Login</StyledLoginLink>
          <CartContainer />
        </CartSpan> 
        )}
      </NavContainer>
      <Dropdown id="Dropdown" ref={dropdownSelection} className={clickedTitle === '' && clickedTitle !== displayName  ? "invisible" : ""}>
        <DropdownContainer>
          <div className="dropdownList">
            {
              clickedTitle !== "" && clickedTitle !== displayName ? navbarSublists[clickedTitle].map((dropItem, idx) => {
                const dropkey = `drop_${idx}`;
                return (
                  dropItem.link && (
                    dropItem.link.startsWith("https://") ? 
                    <a href={dropItem.link} rel="noreferrer" target="_blank" id={dropItem.id} className="dropdownItem" key={dropkey}>
                      {dropItem.name}
                      <div className="dropdownItemText">{dropItem.text}</div>
                    </a>
                    :
                    <Link  id={dropItem.id} to={dropItem.link} className="dropdownItem" key={dropkey} onClick={() => setClickedTitle("")}>
                      {dropItem.name}
                      <div className="dropdownItemText">{dropItem.text}</div>
                    </Link>
                  )
                );
              })
                : null
            }
          </div>
        </DropdownContainer>
      </Dropdown>
       <NameDropdown id="NameDropdown"  ref={nameDropdownSelection} className={clickedTitle !== displayName ? "invisible" : ""}>
        <NameDropdownContainer>
          <div className="dropdownList">
            <div
              id="navbar-dropdown-item-name-logout"
              role="button"
              tabIndex={0}
              className="dropdownItem"
              onClick={() => {  handleLogout()}}
              onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogout()
                  }
                }}
            >
              Logout
            </div>
          </div>
        </NameDropdownContainer>
      </NameDropdown>
    </EnhancedNav>
  );
};

export default NavBar;
