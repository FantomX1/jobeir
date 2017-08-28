// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { browserHistory, Link } from 'react-router';
import { switchCompany } from '../../../user/ducks/';
import { logout } from '../../../auth/ducks';
import docCookies from '../../../../utils/cookies';

class ShellDropdown extends Component {
  state: {
    showDropdown: boolean
  };

  constructor(props) {
    super(props);
    this.state = { showDropdown: false };
  }

  componentDidMount() {
    /**
     * this.mounted is required because setState is asynchronous and cannot
     * be called on an unmounted component. That is why we're internally
     * keeping track of isMounted. If removed there will be a lot of invariant
     * errors in the console.
     * https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html
     */
    this.mounted = true;
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  switchCompanies = (company: { name: string, displayName: string }) => {
    const { dispatch, user } = this.props;
    const data: {} = {
      activeCompany: {
        name: company.name,
        displayName: company.displayName
      }
    };

    dispatch(switchCompany(data, user._id));
  };

  /**
   * handleLogoutClick()
   * Will dispatch to the server to logout the user and at the same time
   * we will remove the JWT session cookie to unauthenticate the user.
   */
  handleLogoutClick = () => {
    this.props.dispatch(logout());
    docCookies.removeItem('SID');
  };

  handleClickOutside = event => {
    if (this.mounted) {
      const domNode = ReactDOM.findDOMNode(this);

      if (!domNode || !domNode.contains(event.target)) {
        this.setState({ showDropdown: false });
      } else {
        this.setState({ showDropdown: !this.state.showDropdown });
      }
    }
  };

  render() {
    const { companies, user } = this.props;

    return (
      <ShellHeaderDropdown>
        {user.avatar ? <ShellHeaderAvatar src={user.avatar} /> : null}
        <ShellDropdownContainer showDropdown={this.state.showDropdown}>
          <ShellDropdownList>
            <ShellDropdownListItem top={true}>
              <ShellDropdownListItemTop>
                {user.firstName} {user.lastName}
              </ShellDropdownListItemTop>
              <ShellDropdownListItemBottom>
                {user.email}
              </ShellDropdownListItemBottom>
            </ShellDropdownListItem>
            <ShellDropdownListItemHr />
            <ShellHeaderDropdownLinks>
              <ShellDropdownListItemLink to="/account/profile/">
                Profile
              </ShellDropdownListItemLink>
              <ShellDropdownListItem onClick={this.handleLogoutClick}>
                Log out
              </ShellDropdownListItem>
            </ShellHeaderDropdownLinks>
          </ShellDropdownList>
          <ShellDropdownList>
            <ShellDropdownListItem top={true}>
              <ShellDropdownListItemTop>Companies</ShellDropdownListItemTop>
              <ShellDropdownListItemBottom
                onClick={() => browserHistory.push('/create/company/about')}
              />
            </ShellDropdownListItem>
            <ShellDropdownListItemHr />

            <ShellHeaderDropdownLinks>
              {companies.created.map(company =>
                <div
                  key={company._id}
                  onClick={() => this.switchCompanies(company)}
                >
                  <ShellDropdownListItem
                    isActive={company.name === companies.activeCompany.name}
                  >
                    {company.displayName}
                  </ShellDropdownListItem>
                </div>
              )}
              <div onClick={() => browserHistory.push('/create/company/about')}>
                <ShellDropdownListItem>+ Create new</ShellDropdownListItem>
              </div>
            </ShellHeaderDropdownLinks>
          </ShellDropdownList>
        </ShellDropdownContainer>
      </ShellHeaderDropdown>
    );
  }
}

const mapStateToProps = state => ({
  companies: state.account.companies,
  user: state.session.user
});

export default connect(mapStateToProps)(ShellDropdown);

const ShellHeaderDropdown = styled.div`
  position: relative;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.pink};
  cursor: pointer;
`;

const ShellHeaderAvatar = styled.img`
  position: relative;
  height: 36px;
  width: 36px;
  border-radius: 50%;
  cursor: pointer;
`;

const ShellHeaderDropdownLinks = styled.div`opacity: 0.7;`;

const ShellDropdownContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  width: 240px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(99, 114, 130, 0.16),
    0 8px 16px rgba(27, 39, 51, 0.08);
  transform: translateZ(0);
  margin-top: 5px;
  padding: 4px 0;
  z-index: 1;
  right: 0px;
  top: 45px;
  transition: all 280ms ease;
  pointer-events: ${props => (props.showDropdown ? 'initial' : 'none')};
  opacity: ${props => (props.showDropdown ? '1' : '0')};
  transform: ${props =>
    props.showDropdown
      ? 'translate3d(0px, 0px, 0px)'
      : 'translate3d(0px, -10px, 0px)'};
`;

const ShellDropdownList = styled.ul`padding: 4px 0;`;

const ShellDropdownListItem = styled.li`
  position: relative;
  list-style: none;
  padding: 12px 25px 9px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: ${props => (props.isActive ? 'rgba(92, 106, 196, 0.1)' : '#fff')};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    height: 100%;
    background: ${props =>
      props.isActive ? props.theme.colors.purple : '#fff'};
  }

  &:last-child {
    border: none;
  }
`;

const ShellDropdownListItemLink = styled(Link)`
  position: relative;
  list-style: none;
  padding: 12px 25px 9px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  background: ${props => (props.isActive ? 'rgba(92, 106, 196, 0.1)' : '#fff')};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    height: 100%;
    background: ${props =>
      props.isActive ? props.theme.colors.purple : '#fff'};
  }

  &:last-child {
    border: none;
  }
`;

const ShellDropdownListItemTop = styled.div`
  font-weight: 800;
  font-size: 16px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
`;

const ShellDropdownListItemBottom = styled.div`
  padding-top: 3px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
`;

const ShellDropdownListItemHr = styled.hr`
  border: none;
  height: 1px;
  background: #f1f0f0;
`;
