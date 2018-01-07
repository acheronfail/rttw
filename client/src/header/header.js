import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { resetUserDataAction } from '../state/actions/entities';
import ToolTip from '@atlaskit/tooltip';

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #222;
  height: 150px;
  padding: 20px;
  color: white;
`;

const appLogoSpin = keyframes`
  from {
    transform-origin: center;
    transform: rotate3d(0, 0, 1, -200deg);
    opacity: 0;
    filter: hue-rotate(0deg);
  }
  to {
    transform-origin: center;
    transform: none;
    opacity: 1;
    filter: hue-rotate(360deg);
  }
`;

const Logo = styled.div`
  animation: ${appLogoSpin} 1.5s ease-in-out;
  width: 200px;
  height: 50px;
  color: yellow;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const TitleButton = styled.button`
  font-size: 1.5em;
`;

export class Header extends PureComponent {
  render() {
    const { onClick } = this.props;
    return (
      <Wrapper>
        <Logo>
          <code>true</code>
        </Logo>
        <ToolTip content="Click this to reset everything!" position="right">
          <div className="rainbow-wrapper">
            <TitleButton onClick={() => onClick()}>Return true to win!</TitleButton>
          </div>
        </ToolTip>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(resetUserDataAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
