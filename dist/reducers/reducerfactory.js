"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const reductions_1 = require("../reductions");
const eta_1 = require("../reductions/eta");
const etaconverter_1 = require("./etaconverter");
// import { GamaReducer } from "./gamareducer" // To Be Deleted
// TODO: implement for AbstractionApplication // To Be Deleted
function constructFor(tree, nextReduction) {
    if (nextReduction instanceof reductions_1.Beta) {
        return new _1.BetaReducer(nextReduction, tree);
    }
    else if (nextReduction instanceof reductions_1.Alpha) {
        return new _1.AlphaConverter(nextReduction, tree);
    }
    else if (nextReduction instanceof reductions_1.Expansion) {
        return new _1.Expander(nextReduction, tree);
    }
    else if (nextReduction instanceof eta_1.Eta) {
        return new etaconverter_1.EtaConverter(nextReduction, tree);
    }
    // To Be Deleted
    // else if (nextReduction instanceof Gama) {
    //   // maybe nothing of this will prevail
    //   // I may implement everything including Gama reduction in the REPL - frontend side
    //   // check arity - ofc
    //   // but instead of throwing -> just return Gama with warning
    //   if (GamaReducer.assertReduction(nextReduction)) {
    //     return new GamaReducer(nextReduction, tree)
    //   }
    //   else {
    //     throw new Error(`Invalid arguments of ${nextReduction.abstraction[0]}.`)
    //   }
    // }
    else {
        return new _1.EmptyReducer(tree); // for None
    }
}
exports.constructFor = constructFor;
