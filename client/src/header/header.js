import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { resetUserDataAction } from '../state/actions/entities';
import ToolTip from '@atlaskit/tooltip';

export class Header extends PureComponent {
  render() {
    const { onClick } = this.props;
    return (
      <header className="app-header">
        <div className="app-logo">
          <code>true</code>
        </div>
        <ToolTip content="Click this to reset everything!" position="right">
          <div className="rainbow-wrapper">
            <button onClick={() => onClick()} className="app-title">
              Return true to win!
            </button>
          </div>
        </ToolTip>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  onClick: () => dispatch(resetUserDataAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
