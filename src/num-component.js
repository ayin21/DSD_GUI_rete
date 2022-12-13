import { Component, Input, Output } from "rete";



export class NumComponent extends Component {
  constructor(socket) {
    super("Number");
    this.socket = socket;
  }

  builder(node) {
    const out = new Output('num', "Number", this.socket);
    node.addOutput(out);
    const input = new Input("num2", "Number", this.socket);
    node.addInput(input);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
    inputs["num2"] = node.data.num2;
  }
}

export class BoolComponent extends Component {
  constructor(socket) {
    super("Boolean");
    this.socket = socket;
  }

  builder(node) {
    const out = new Output('bool', "Boolean", this.socket);
    node.addOutput(out);
    const input = new Input("bool2", "Boolean", this.socket);
    node.addInput(input);
    const out2 = new Output('bool3', "Boolean", this.socket);
    node.addOutput(out2);
  }

  worker(node, inputs, outputs) {
    outputs['bool'] = node.data.num;
    outputs['bool3'] = node.data.num3;
    inputs["bool2"] = node.data.num2;
  }
}