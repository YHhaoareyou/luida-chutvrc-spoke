import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import NodeEditor from "./NodeEditor";
import InputGroup from "../inputs/InputGroup";
import BooleanInput from "../inputs/BooleanInput";
import LuidaObjectNode from "../../editor/nodes/LuidaObjectNode";
import { ObjectGroup } from "styled-icons/fa-solid/ObjectGroup";

const Warning = styled.div`
  padding: 4px 8px;
  color: ${props => props.theme.orange};
  white-space: pre-wrap;
`;

export default class LuidaObjectNodeEditor extends Component {
  static propTypes = {
    editor: PropTypes.object,
    node: PropTypes.object
  };

  static iconComponent = ObjectGroup;

  static description =
    "An object a LUIDA experiment can show, hide, move and react to.\nDrag models, text or images into it in the Hierarchy. The experiment's flow refers to it by this node's name.";

  onChangeInteractable = interactable => {
    this.props.editor.setPropertySelected("interactable", interactable);
  };

  render() {
    const node = this.props.node;
    const name = (node.name || "").trim();
    const duplicates = LuidaObjectNode.sameNameNodes(node).length;

    return (
      <NodeEditor description={LuidaObjectNodeEditor.description} {...this.props}>
        <InputGroup name="Clickable" info="Lets the experiment react when a participant clicks this object.">
          <BooleanInput value={node.interactable} onChange={this.onChangeInteractable} />
        </InputGroup>
        {name === "" && <Warning>Give this node a name. The experiment's flow refers to the object by it.</Warning>}
        {name !== "" && duplicates > 0 && (
          <Warning>
            {`Another LUIDA Object is also named "${name}". The experiment can only reach one of them; give each its own name.`}
          </Warning>
        )}
      </NodeEditor>
    );
  }
}
