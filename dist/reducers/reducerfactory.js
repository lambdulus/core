"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructFor = void 0;
const _1 = require("./");
const reductions_1 = require("../reductions");
const eta_1 = require("../reductions/eta");
const etaconverter_1 = require("./etaconverter");
const gamareducer_1 = require("./gamareducer");
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
    else if (nextReduction instanceof reductions_1.Gama) {
        if (gamareducer_1.GamaReducer.assertReduction(nextReduction)) {
            return new gamareducer_1.GamaReducer(nextReduction, tree);
        }
        else {
            throw new Error(`Invalid arguments of ${nextReduction.abstraction[0]}.`);
        }
    }
    else {
        return new _1.EmptyReducer(tree); // for None
    }
}
exports.constructFor = constructFor;
