import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PrimaryNavLogo from '../components/PrimaryNavLogo';
import PrimaryNavLinks from '../components/PrimaryNavLinks';
import PrimaryNavNav from '../components/PrimaryNavNav';

const PrimaryNav = props => {
  return (
    <Navigation isAuthenticated={props.isAuthenticated}>
      <NavigationContainer>
        <PrimaryNavLogo />
        <PrimaryNavLinks />
      </NavigationContainer>
    </Navigation>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.session.auth.isAuthenticated
});

export default connect(mapStateToProps)(PrimaryNav);

const Navigation = styled.nav`
  flex: 1;
  padding: 0 20px;
  background: #fff;
  box-shadow: ${props => (props.isAuthenticated ? '0px 1px 2px rgba(0, 0, 0, 0.16)' : 'none')};
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  max-width: ${props => props.theme.width.max};
`;
