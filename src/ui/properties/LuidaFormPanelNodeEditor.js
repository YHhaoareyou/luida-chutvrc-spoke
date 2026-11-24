import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeEditor from "./NodeEditor";
import NumericInputGroup from "../inputs/NumericInputGroup";
import { WindowMaximize } from "styled-icons/fa-solid/WindowMaximize";

export default class LuidaFormPanelNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = WindowMaximize;

  static description =
    "Where a LUIDA experiment shows its questionnaires to a participant in VR.\nThe panel appears here, facing the way the blue plane faces. A scene can have one.";

  onChangeWidth = width => {
    this.props.editor.setPropertySelected("width", width);
  };

  render() {
    const node = this.props.node;

    return (
      <NodeEditor description={LuidaFormPanelNodeEditor.description} {...this.props}>
        <NumericInputGroup
          name="Width"
          info="Width of the panel in metres. Its height follows."
          min={0.2}
          max={5}
          smallStep={0.01}
          mediumStep={0.1}
          largeStep={0.5}
          value={node.width}
          onChange={this.onChangeWidth}
          unit="m"
        />
      </NodeEditor>
    );
  }
}
