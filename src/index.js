import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";

import headBehaviour from "./head-behaviour.json" assert { type: "json" };
import { BoolComponent, NumComponent } from "./num-component";

async function createNodes() {
  const n1 = await numComponent.createNode({ num: 2 });
  const n2 = await numComponent.createNode({ num: 8 });
  const n3 = await boolComponent.createNode({bool: true});
  return [n1, n2, n3];
}

const container = document.querySelector("#rete");
const editor = new Rete.NodeEditor("rete-dsd@0.0.1", container);
const engine = new Rete.Engine("rete-dsd@0.0.1");

editor.use(ConnectionPlugin);
editor.use(VueRenderPlugin);
editor.use(AutoArrangePlugin, {
  margin: { x: 50, y: 50 },
  offset: { x: 50, y: 50 },
});
editor.view.resize();

editor.on(
  "process nodecreated noderemoved connectioncreated connectionremoved",
  async () => {
    await engine.abort();
    await engine.process(editor.toJSON());
  }
);

const numSocket = new Rete.Socket("Number value");
const boolSocket = new Rete.Socket("Boolean value")
const numComponent = new NumComponent(numSocket);
const boolComponent = new BoolComponent(boolSocket)

editor.register(numComponent);
engine.register(numComponent);
editor.register(boolComponent);
engine.register(boolComponent);


createNodes().then((nodes) => {
  nodes.forEach((node) => editor.addNode(node));
});

editor.trigger("arrange");

console.log(headBehaviour);
