/**
* Unit tests for Elucidator
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

const Chai = require("chai");
const Expect = Chai.expect;

const libFable = require('fable');
const _ElucidatorTestConfig = (
{
    Product: 'ElucidatorTest'
});
const getFable = () => { return new libFable(_ElucidatorTestConfig); };

const libElucidator = require('../source/Elucidator.js');


let libManyfest = require('manyfest');

suite
(
	'Elucidator Injected Solvers',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Single Injected Solver',
			()=>
			{
				test
				(
					'Inject a complex multi-instruction solver.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator(getFable(),);
						let tmpBillSolution = (
							{
								"Description":
								{
									"Namespace": "Custom",
									"Operation": "TallyBill",
									"Synopsis": "Add up the bill: BillTotal = GrapeCost + AppleCost + SteakCost + PotatoCost + WineCost + MilkCost"
								},
							
								"Inputs": 
								{
									"GrapeCost": { },
									"AppleCost": { },
									"SteakCost": { },
									"PotatoCost": { },
									"WineCost": { "Name": "Vino Cost" },
									"MilkCost": { }
								},
							
								"Outputs":
								{
									"FruitTotal": { "Name": "Total Fruit Cost"},
									"FoodTotal": { "Name": "Total Fruit Cost"},
									"DinnerTotal": { "Name": "Total Dinner Cost"},
									"DrinksTotal": { "Name": "Total Cost of the Drinks"},
									"MealCost": { "Name": "Total Meal Cost"}
								},
								
								"Log":
								{
									"PreOperation": "Add [ {{Name:DinnerTotal}} ] and [ {{Name:DrinksTotal}} ], storing the value in [ {{Name:MealCost}} ].",
									"PostOperation": "Operation complete; [ {{Name:MealCost}} ] = {{OutputValue:DinnerTotal}} + {{OutputValue:DrinksTotal}} = {{OutputValue:MealCost}}"
								},

								"Steps":
								[
									{
										"Namespace": "PreciseMath",
										"Instruction": "add",
										"InputHashAddressMap": 
											{
												"a": "GrapeCost",
												"b": "AppleCost"
											},
										"OutputHashAddressMap":
											{
												"x": "FruitTotal"
											}
									},
									{
										"Namespace": "PreciseMath",
										"Instruction": "add",
										"InputHashAddressMap": 
											{
												"a": "SteakCost",
												"b": "PotatoCost"
											},
										"OutputHashAddressMap":
											{
												"x": "FoodTotal"
											}
									},
									{
										"Namespace": "PreciseMath",
										"Instruction": "add",
										"InputHashAddressMap": 
											{
												"a": "FruitTotal",
												"b": "FoodTotal"
											},
										"OutputHashAddressMap":
											{
												"x": "DinnerTotal"
											}
									},
									{
										"Namespace": "PreciseMath",
										"Instruction": "add",
										"InputHashAddressMap": 
											{
												"a": "WineCost",
												"b": "MilkCost"
											},
										"OutputHashAddressMap":
											{
												"x": "DrinksTotal"
											}
									},
									{
										"Namespace": "PreciseMath",
										"Instruction": "add",
										"InputHashAddressMap": 
											{
												"a": "DinnerTotal",
												"b": "DrinksTotal"
											},
										"OutputHashAddressMap":
											{
												"x": "MealCost"
											}
									}
								]
							});

						// Create an operation in Elucidator to reuse
						_Elucidator.addOperation('Bill','Tally', tmpBillSolution);

						let tmpFirstBillData = (
							{
								GrapeCost:1000, 
								AppleCost:10, 
								SteakCost:100, 
								PotatoCost:1, 
								WineCost:10, 
								MilkCost:2
							});
						let tmpOperationOutput = _Elucidator.solveInternalOperation('Bill', 'Tally', tmpFirstBillData);
						Expect(tmpFirstBillData.MealCost).to.equal('1123');
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal("Add [ DinnerTotal ] and [ DrinksTotal ], storing the value in [ MealCost ].");
						let tmpSecondBillData = (
							{
								GrapeCost:2000, 
								AppleCost:10, 
								SteakCost:200, 
								PotatoCost:1, 
								WineCost:10, 
								MilkCost:2
							});
						_Elucidator.solveInternalOperation('Bill', 'Tally', tmpSecondBillData);
						Expect(tmpSecondBillData.MealCost).to.equal('2223');
						fTestComplete();
					}
				);
			}
		);
	}
);
