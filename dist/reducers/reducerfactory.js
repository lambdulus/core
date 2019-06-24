"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
// import { Reducer } from "../visitors/normalevaluator"
const reductions_1 = require("../reductions");
const eta_1 = require("../reductions/eta");
const etaconverter_1 = require("./etaconverter");
// TODO: implement for AbstractionApplication
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
    else {
        return new _1.EmptyReducer(tree); // for None
    }
}
exports.constructFor = constructFor;
