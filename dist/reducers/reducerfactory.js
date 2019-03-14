"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const betareducer_1 = require("./betareducer");
const alphaconvertor_1 = require("./alphaconvertor");
const expandor_1 = require("./expandor");
const visitors_1 = require("../visitors");
const emptyreducer_1 = require("./emptyreducer");
var ReducerFactory;
(function (ReducerFactory) {
    function constructFor(tree, nextReduction) {
        if (nextReduction instanceof visitors_1.Reductions.Beta) {
            return new betareducer_1.BetaReducer(nextReduction, tree);
        }
        else if (nextReduction instanceof visitors_1.Reductions.Alpha) {
            return new alphaconvertor_1.AlphaConvertor(nextReduction, tree);
        }
        else if (nextReduction instanceof visitors_1.Reductions.Expansion) {
            return new expandor_1.Expandor(nextReduction, tree);
        }
        else {
            return new emptyreducer_1.EmptyReducer(tree); // for None
        }
    }
    ReducerFactory.constructFor = constructFor;
})(ReducerFactory = exports.ReducerFactory || (exports.ReducerFactory = {}));
