// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import ProfileEditForm from '../../../user-input/forms/form/ProfileEditForm';

class Profile extends Component {
  render() {
    const { user } = this.props;
    return (
      <ProfileDarkBackground>
        <ProfileContainer>
          <ProfileHeader>Profile info</ProfileHeader>
          <ProfileSubHeader>Edit your profile info</ProfileSubHeader>
          <ProfileEditForm />
        </ProfileContainer>
      </ProfileDarkBackground>
    );
  }
}

const mapStateToProps = state => ({
  user: state.session.user
});

export default connect(mapStateToProps)(Profile);

const ProfileDarkBackground = styled.div`
  border-top: 1px solid #eceaea;
  background: #f9f8f7;
  min-height: calc(100vh - 300px);
`;

const ProfileContainer = styled.div`
  width: 1080px;
  margin: 0 auto;
`;

const ProfileHeader = styled.h2`
  font-weight: 600;
  padding: 20px 0 5px;
  font-size: 22px;
`;

const ProfileSubHeader = styled.h3`
  font-weight: 400;
  font-size: 18px;
  color: #9ea4a8;
  margin-bottom: 50px;
`;
