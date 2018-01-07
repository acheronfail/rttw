import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.pre`
  border: 1px solid #444;
  background-color: #f7f7f7;
  height: 40px;
  padding: 10px;

  /* Change colour of results text if there's an error or if code returned true */
  ${({ error, resultSuccessful }) => {
    if (error) return 'color: #a00;';
    if (resultSuccessful) return 'color: #080;';
  }};
`;

const CharCount = styled.span`
  color: #a5a5a5;
`;

export class Results extends PureComponent {
  render() {
    const { results, solution, resultSuccessful, error } = this.props;
    const icon = resultSuccessful && !error ? '✔' : '✖';
    const text = error ? error.message : `Result: ${results || undefined}`;
    return (
      <Wrapper error={error} resultSuccessful={resultSuccessful}>
        {icon} {text}
        <br />
        <CharCount>
          {'//'} {solution.length} {solution.length === 1 ? 'char' : 'chars'}
        </CharCount>
      </Wrapper>
    );
  }
}

const mapStateToProps = (state) => ({
  solution: state.ui.solution,
  results: state.ui.results,
  resultSuccessful: state.ui.resultSuccessful,
  // TODO: not currently verifying solutions on the server
  // resultVerified: state.ui.resultVerified,
  error: state.ui.wasError && state.ui.error
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Results);
