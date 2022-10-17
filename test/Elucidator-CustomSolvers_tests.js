/**
* Unit tests for Elucidator
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var Chai = require("chai");
var Expect = Chai.expect;

let libElucidator = require('../source/Elucidator.js');
let libManyfest = require('manyfest');

suite
(
	'Elucidator Custom Solvers',
	function()
	{
		setup (()=> {} );

		suite
		(
			'Single operation and instruction solutions',
			()=>
			{
				test
				(
					'Alter inputs and outputs with a base hash translation table.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {CarrotCost:1000, AppleCost:10};
						let tmpBillSolution = (
								{
									"Description":
									{
										"Namespace": "Custom",
										"Operation": "BillSolution",
										"Synopsis": "Add up the bill: BillTotal =  CarrotCost + AppleCost"
									},
								
									"Inputs": 
									{
										"CarrotCost": { "Hash": "a", "Type": "Number" },
										"AppleCost": { "Hash": "b", "Type": "Number" }
									},
								
									"Outputs":
									{
										"BillTotal": { "Hash": "x", "Type": "Number" }
									},

									"InputHashTranslationTable":
									{
										"a":"CarrotCost",
										"b":"AppleCost"
									},
									
									"OutputHashTranslationTable":
									{
										"x":"BillTotal"
									},
									
									"Steps":
									[
										{
											"Ordinal": 0,
											"Name": "Add",
								
											"Namespace": "Math",
											"Operation": "add"
										}
									]
								});
						let tmpOperationContext = _Elucidator.solveOperation(tmpBillSolution, tmpData);
						Expect(tmpData.BillTotal).to.equal(1010);
						fTestComplete();
					}
				);
				test
				(
					'Remap values, ignoring operation inputs, custom messaging.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {CarrotCost:1000, AppleCost:10};
						let tmpDescriptionManyfest = new libManyfest({Scope:'Billz',Descriptors:{CarrotCost:{Name:'Carrot Cost'}}});
						let tmpBillSolution = (
								{
									"Description":
									{
										"Namespace": "Custom",
										"Operation": "TallyBill",
										"Synopsis": "Add up the bill: BillTotal =  CarrotCost + AppleCost"
									},
								
									"Inputs": 
									{
										"a": { "Hash": "a", "Type": "Number" },
										"b": { "Hash": "b", "Type": "Number" }
									},
								
									"Outputs":
									{
										"x": { "Hash": "x", "Type": "Number" }
									},
									
									"Log":
									{
										"PreOperation": "Add [ {{Name:CarrotCost}} ] and [ {{Name:AppleCost}} ], storing the value in [ {{Name:BillTotal}} ].",
										"PostOperation": "Operation complete; [ {{Name:AppleTotal}} ] = {{InputValue:CarrotCost}} + {{InputValue:AppleCost}} = {{OutputValue:BillTotal}}"
									},

									"Steps":
									[
										{
											"Ordinal": 0,
											"Name": "Add",
								
											"Namespace": "Math",
											"Instruction": "add",
								
											"InputHashAddressMap": 
												{
													"a": "CarrotCost",
													"b": "AppleCost"
												},
											
											"OutputHashAddressMap":
												{
													"x": "BillTotal"
												}
										}
									]
								});
						let tmpOperationOutput = _Elucidator.solveOperation(tmpBillSolution, tmpData, tmpData, tmpDescriptionManyfest);
						Expect(tmpData.BillTotal).to.equal(1010);
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal('Add [ Carrot Cost ] and [ AppleCost ], storing the value in [ BillTotal ].');
						Expect(tmpOperationOutput.SolutionLog[1]).to.equal('Operation complete; [ AppleTotal ] = 1000 + 10 = 1010');
						fTestComplete();
					}
				);
				test
				(
					'Alter inputs and outputs with a step hash translation table.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {CarrotCost:1000, AppleCost:10};
						let tmpBillSolution = (
								{
									"Description":
									{
										"Namespace": "Custom",
										"Operation": "BillSolution",
										"Synopsis": "Add up the bill: BillTotal =  CarrotCost + AppleCost"
									},
								
									"Inputs": 
									{
										"CarrotCost": { "Hash": "a", "Type": "Number" },
										"AppleCost": { "Hash": "b", "Type": "Number" }
									},
								
									"Outputs":
									{
										"BillTotal": { "Hash": "x", "Type": "Number" }
									},

									"InputHashTranslationTable":
									{
										"a":"CarrotCost",
										"b":"AppleCost"
									},
									
									"OutputHashTranslationTable":
									{
										"x":"BillTotal"
									},
									
									"Steps":
									[
										{
											"Ordinal": 0,
											"Name": "Add",
								
											"Namespace": "Math",
											"Operation": "add",
											
										}
									]
								});
						let tmpOperationContext = _Elucidator.solveOperation(tmpBillSolution, tmpData);
						Expect(tmpData.BillTotal).to.equal(1010);
						fTestComplete();
					}
				);
				test
				(
					'Multiple instructions.',
					(fTestComplete)=>
					{
						let _Elucidator = new libElucidator();
						let tmpData = {GrapeCost:1000, AppleCost:10, SteakCost:100, PotatoCost:1, WineCost:10, MilkCost:2};
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
											"Namespace": "Math",
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
											"Namespace": "Math",
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
											"Namespace": "Math",
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
											"Namespace": "Math",
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
											"Namespace": "Math",
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
						let tmpOperationOutput = _Elucidator.solveOperation(tmpBillSolution, tmpData);
						Expect(tmpData.MealCost).to.equal(1123);
						Expect(tmpOperationOutput.SolutionLog[0]).to.equal("Add [ DinnerTotal ] and [ DrinksTotal ], storing the value in [ MealCost ].");
						fTestComplete();
					}
				);
			}
		);
	}
);
