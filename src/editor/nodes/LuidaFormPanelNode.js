import { Object3D, PlaneBufferGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";
import EditorNodeMixin from "./EditorNodeMixin";

// The panel's proportions in VR: questionnaires are laid out four units wide and three high.
const ASPECT = 3 / 4;

/**
 * Where a LUIDA experiment shows its questionnaires to a participant in VR: the panel appears at
 * this node's position, facing the way the node faces, with the given width. Outside VR
 * questionnaires are shown over the page and this node has no effect.
 */
export default class LuidaFormPanelNode extends EditorNodeMixin(Object3D) {
  static componentName = "luida-form";

  static nodeName = "LUIDA Form Panel";

  // A second panel would leave the experiment guessing which one to use.
  static canAddNode(editor) {
    return editor.scene.findNodeByType(LuidaFormPanelNode) === null;
  }

  static async deserialize(editor, json) {
    const node = await super.deserialize(editor, json);

    const { width } = json.components.find(c => c.name === "luida-form").props;

    node.width = typeof width === "number" && width > 0 ? width : 1.2;

    return node;
  }

  constructor(editor) {
    super(editor);

    this._width = 1.2;

    // Shown in the editor only, so the author sees the panel's size and facing.
    const material = new MeshBasicMaterial({ color: 0x2457c5, transparent: true, opacity: 0.35, side: DoubleSide });
    this.helper = new Mesh(new PlaneBufferGeometry(1, 1), material);
    this.helper.layers.set(1);
    this.add(this.helper);
    this.updateHelper();
  }

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    this.updateHelper();
  }

  updateHelper() {
    if (this.helper) this.helper.scale.set(this._width, this._width * ASPECT, 1);
  }

  copy(source, recursive = true) {
    if (recursive) {
      this.remove(this.helper);
    }

    super.copy(source, recursive);

    if (recursive) {
      const helperIndex = source.children.indexOf(source.helper);

      if (helperIndex !== -1) {
        this.helper = this.children[helperIndex];
      }
    }

    this.width = source.width;

    return this;
  }

  serialize() {
    return super.serialize({
      "luida-form": {
        width: this.width
      }
    });
  }

  prepareForExport() {
    super.prepareForExport();
    this.remove(this.helper);
    this.addGLTFComponent("luida-form", {
      width: this.width
    });
    this.replaceObject();
  }
}
