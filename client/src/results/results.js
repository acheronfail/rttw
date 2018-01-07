import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.pre`
  border: 1px solid #444;
  background-color: #f7f7f7;
  height: 40px;
  padding: 10px;

  ${(props) => props.resultSuccessful && 'color: #080'};
`;

export class Results extends PureComponent {
  getIcon() {
    const { resultVerified } = this.props;
    return resultVerified ? '✔' : '✖';
  }

  render() {
    const { results, resultSuccessful } = this.props;
    return (
      <Wrapper resultSuccessful={resultSuccessful}>
        {this.getIcon()} Result: {results}
        <br />
        {/* TODO: good way of verifying solution length */}
        {/*       ^^ maybe just return the verified solution in the request ? */}
        {/* TODO: show a verified indicator? should it change - yes it should */}
        {/* Bytecount: {currentSolution.length} */}
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  results: state.ui.results,
  resultSuccessful: state.ui.resultSuccessful,
  resultVerified: state.ui.resultVerified
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
