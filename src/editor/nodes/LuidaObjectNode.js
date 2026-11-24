import { Group } from "three";
import EditorNodeMixin from "./EditorNodeMixin";

/**
 * Makes everything placed under it one object that a LUIDA experiment can address. The experiment's
 * Spec refers to the object by this node's name and can show, hide and move it, change the text of
 * a Text node under it, and react when a participant clicks it.
 */
export default class LuidaObjectNode extends EditorNodeMixin(Group) {
  static componentName = "luida-object";

  static nodeName = "LUIDA Object";

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const { interactable } = json.components.find(c => c.name === "luida-object").props;

    node.interactable = !!interactable;

    return node;
  }

  /** The other LUIDA Object nodes of the scene that have the same name as the given one. */
  static sameNameNodes(node) {
    const others = [];
    const scene = node.editor && node.editor.scene;

    if (!scene) return others;

    scene.traverse(object => {
      if (object !== node && object.isNode && object.constructor === LuidaObjectNode && object.name === node.name) {
        others.push(object);
      }
    });

    return others;
  }

  constructor(editor) {
    super(editor);
    this.interactable = false;
  }

  copy(source, recursive = true) {
    super.copy(source, recursive);
    this.interactable = source.interactable;
    return this;
  }

  serialize() {
    return super.serialize({
      "luida-object": {
        interactable: this.interactable
      }
    });
  }

  prepareForExport() {
    super.prepareForExport();

    // The export merges static meshes into one, after which a single object can no longer be
    // shown, hidden or moved on its own. Everything under this node stays a mesh of its own.
    this.traverse(child => {
      if (child === this) return;
      if (child.isNode && typeof child.combine === "boolean") child.combine = false;
      if (child.isMesh) child._combine = false;
    });

    // The name is written into the component as well, so the experiment does not depend on what
    // the exporter or a loader does to node names.
    this.addGLTFComponent("luida-object", {
      name: this.name,
      interactable: this.interactable
    });
  }
}
