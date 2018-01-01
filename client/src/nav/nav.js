import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { selectPuzzleAction } from '../state/actions/ui';
import { AkFieldRadioGroup as RadioGroup } from '@atlaskit/field-radio-group';
import Lozenge from '@atlaskit/lozenge';

// TODO: when names are too long, make nav horizontally scrollable
export class Nav extends PureComponent {
  render() {
    const { onChange, items } = this.props;
    return (
      <nav>
        <h3>Puzzles</h3>
        <div className="list">
          <RadioGroup
            onRadioChange={({ target: { value } }) => onChange(value | 0)}
            items={items}
          />
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state.entities;
  const completedPuzzles = Object.keys(user.solutions);

  return {
    items: state.entities.puzzles.map(({ name: puzzleName }, i) => {
      const userSolution = user.solutions[puzzleName] || null;
      const hasCompleted = completedPuzzles.includes(puzzleName);
      const statusLabel = userSolution && `${userSolution.length} bytes`;

      return {
        name: 'nav-item',
        value: `${i}`,
        label: (
          <span>
            <Lozenge appearance={hasCompleted ? 'success' : 'default'}>
              {hasCompleted ? statusLabel || 'solved' : 'unsolved'}
            </Lozenge>
            &nbsp;
            {puzzleName}
          </span>
        ),
        isSelected: i === state.ui.selectedPuzzle
      };
    })
  };
};

const mapDispatchToProps = (dispatch) => ({
  onChange: (index) => dispatch(selectPuzzleAction(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(Nav);