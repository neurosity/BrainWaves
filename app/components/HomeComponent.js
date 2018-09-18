// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isNil } from "lodash";
import {
  Grid,
  Button,
  Header,
  Segment,
  List,
  Image,
  Modal,
  Step
} from "semantic-ui-react";
import styles from "./styles/common.css";
import { EXPERIMENTS, SCREENS } from "../constants/constants";

import faceHouseIcon from "../assets/face_house/face_house_icon.jpg";
import { readWorkspaces, readAndParseState } from "../utils/filesystem/storage";
import InputModal from "./InputModal";

const HOME_STEPS = {
  RECENT: "RECENT",
  NEW: "NEW EXPERIMENT",
  PRACTICE: "PRACTICE"
};

interface Props {
  jupyterActions: Object;
  deviceActions: Object;
  experimentActions: Object;
  rawObservable: ?any;
  mainChannel: ?any;
}

interface State {
  activeStep: string;
  recentWorkspaces: Array<string>;
  isNewExperimentModalOpen: boolean;
  selectedExperimentType: EXPERIMENTS;
}

export default class Home extends Component<Props, State> {
  props: Props;
  state: State;
  handleNewExperiment: EXPERIMENTS => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      activeStep: HOME_STEPS.RECENT,
      recentWorkspaces: [],
      isNewExperimentModalOpen: false,
      selectedExperimentType: EXPERIMENTS.NONE
    };
    this.handleStepClick = this.handleStepClick.bind(this);
    this.handleNewExperiment = this.handleNewExperiment.bind(this);
    this.handleLoadNewExperiment = this.handleLoadNewExperiment.bind(this);
  }

  componentDidMount() {
    this.setState({ recentWorkspaces: readWorkspaces() });
  }

  handleStepClick(e: Object, props: Object) {
    this.setState({ activeStep: props.title });
  }

  handleNewExperiment(experimentType: EXPERIMENTS) {
    this.setState({
      isNewExperimentModalOpen: true,
      selectedExperimentType: experimentType
    });
  }

  handleLoadNewExperiment(title: string) {
    this.setState({ isNewExperimentModalOpen: false });
    // Don't create new workspace if it already exists or title is too short
    if (!this.state.recentWorkspaces.includes(title) && title.length >= 1) {
      this.props.experimentActions.createNewWorkspace({
        title,
        type: this.state.selectedExperimentType
      });
      // this.props.experimentActions.setType(this.state.selectedExperimentType);
      // this.props.experimentActions.setTitle(title);
      // this.props.experimentActions.loadDefaultTimeline();
      this.props.history.push(SCREENS.DESIGN.route);
    }
  }

  handleLoadRecentWorkspace(dir: string) {
    const recentWorkspaceState = readAndParseState(dir);
    if (!isNil(recentWorkspaceState)) {
      this.props.experimentActions.setState(recentWorkspaceState);
    }
  }

  // TODO: Figure out how to make this not overflow. Lists?
  renderSectionContent() {
    switch (this.state.activeStep) {
      case HOME_STEPS.RECENT:
        return (
          <div>
            <Grid stackable columns="equal">
              {this.state.recentWorkspaces.map((dir, index) => (
                <Grid.Row>
                  <Button
                    secondary
                    onClick={() => this.handleLoadRecentWorkspace(dir)}
                  >
                    Open Workspace
                  </Button>
                  <Segment basic compact textAlign="center">
                    <Header as="h3"> {dir}</Header>
                  </Segment>
                </Grid.Row>
              ))}
            </Grid>
          </div>
        );
      case HOME_STEPS.NEW:
      default:
        return (
          <Grid columns="equal" relaxed padded>
            <Grid.Column>
              <Segment basic>
                <Image size="huge" src={faceHouseIcon} />
                <Header as="h1">Faces and Houses</Header>
                <p>
                  Explore the N170 ERP that is produce in response to viewing
                  faces (as compared to non human objects). It is called the
                  N170 because it is a negative deflection that occurs around
                  170ms after perceiving a face.
                </p>
                <Button
                  primary
                  onClick={() => this.handleNewExperiment(EXPERIMENTS.N170)}
                >
                  Start Experiment
                </Button>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment basic>
                <Image size="huge" src={faceHouseIcon} />
                <Header as="h1">Oddball</Header>
                <p>
                  Explore the P300 ERP that is produced after an unexpected
                  'oddball' stimulus. The P300 ERP is a positive deflection that
                  occurs 300ms after stimulus onset.
                </p>
                <Button
                  primary
                  onClick={() => this.handleNewExperiment(EXPERIMENTS.P300)}
                >
                  Start Experiment
                </Button>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment size="huge" basic>
                <Image size="huge" src={faceHouseIcon} />
                <Header as="h1">Custom</Header>
                <p>Design your own EEG experiment!</p>
                <Button
                  primary
                  onClick={() => this.handleNewExperiment(EXPERIMENTS.CUSTOM)}
                >
                  Start Experiment
                </Button>
              </Segment>
            </Grid.Column>
          </Grid>
        );
    }
  }

  render() {
    return (
      <div className={styles.mainContainer} data-tid="container">
        <Segment raised color="red">
          <Step.Group>
            <Step
              link
              title={HOME_STEPS.RECENT}
              active={this.state.activeStep === HOME_STEPS.RECENT}
              onClick={this.handleStepClick}
            />
            <Step
              link
              title={HOME_STEPS.NEW}
              active={this.state.activeStep === HOME_STEPS.NEW}
              onClick={this.handleStepClick}
            />
          </Step.Group>
        </Segment>
        {this.renderSectionContent()}
        <InputModal
          open={this.state.isNewExperimentModalOpen}
          onClose={this.handleLoadNewExperiment}
          placeholder={this.state.selectedExperimentType}
          header="Enter a title for this experiment"
        />
      </div>
    );
  }
}
