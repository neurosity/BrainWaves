import React, { PureComponent } from 'react';
import { Button, ButtonProps } from 'semantic-ui-react';

interface Props {
  isPreviewing: boolean;
  onClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    data: ButtonProps
  ) => void;
}

export default class PreviewButton extends PureComponent<Props> {
  render() {
    if (!this.props.isPreviewing) {
      return (
        <Button secondary onClick={this.props.onClick}>
          Preview Experiment
        </Button>
      );
    }
    return (
      <Button negative onClick={this.props.onClick}>
        Stop Preview
      </Button>
    );
  }
}
