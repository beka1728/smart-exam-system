export const questionTemplates = {
  physics: [
    "Calculate the {measurement} of a {object} with {property1} = {value1} {unit1} and {property2} = {value2} {unit2}",
    "A {system} has {component1} = {value1} {unit1} and {component2} = {value2} {unit2}. Find the {target_measurement}",
    "In an experiment involving {phenomenon}, if {variable1} = {value1} and {variable2} = {value2}, determine the {result}"
  ],
  chemistry: [
    "Calculate the {calculation_type} of {compound} when {condition1} = {value1} {unit1} and {condition2} = {value2} {unit2}",
    "In a reaction between {reactant1} and {reactant2}, if {parameter} = {value} {unit}, find the {product_property}",
    "A solution contains {substance} with {property} = {value} {unit}. Calculate the {target_value}"
  ],
  mathematics: [
    "Solve for {variable} when {equation_part1} = {value1} and {equation_part2} = {value2}",
    "A {geometric_shape} has {dimension1} = {value1} {unit} and {dimension2} = {value2} {unit}. Find the {calculation_target}",
    "Given the function f(x) = {function_type} where {parameter} = {value}, calculate {target}"
  ],
  programming: [
    "Write a {language} function that {task} with input parameters {param_type} and returns {return_type}",
    "Debug the following {language} code that implements {algorithm} with {constraint} and {requirement}",
    "Design a {data_structure} that supports {operation1} and {operation2} with time complexity {complexity}"
  ]
};

export const variablePools = {
  physics: {
    measurement: ['force', 'velocity', 'acceleration', 'energy', 'momentum', 'power'],
    object: ['pendulum', 'projectile', 'spring', 'circuit', 'wave', 'particle'],
    property1: ['mass', 'length', 'time', 'voltage', 'current', 'frequency'],
    property2: ['height', 'angle', 'resistance', 'capacitance', 'wavelength', 'amplitude'],
    value1: [10, 15, 20, 25, 30, 35, 40, 45, 50],
    value2: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0],
    unit1: ['kg', 'm', 's', 'V', 'A', 'Hz'],
    unit2: ['m', 'degrees', 'Ω', 'F', 'm', 'cm'],
    system: ['circuit', 'pendulum system', 'spring system', 'wave system'],
    component1: ['voltage', 'mass', 'spring constant', 'frequency'],
    component2: ['current', 'length', 'displacement', 'wavelength'],
    target_measurement: ['power', 'period', 'energy', 'velocity'],
    phenomenon: ['wave motion', 'projectile motion', 'circular motion', 'harmonic motion'],
    variable1: ['frequency', 'mass', 'voltage', 'time'],
    variable2: ['wavelength', 'height', 'resistance', 'distance'],
    result: ['velocity', 'energy', 'power', 'momentum']
  },
  chemistry: {
    calculation_type: ['molarity', 'molality', 'pH', 'concentration', 'yield', 'equilibrium constant'],
    compound: ['NaCl', 'H2SO4', 'CaCO3', 'CH4', 'C6H12O6', 'NH3'],
    condition1: ['temperature', 'pressure', 'volume', 'amount', 'concentration'],
    condition2: ['time', 'catalyst amount', 'surface area', 'pH', 'ionic strength'],
    value1: [25, 30, 35, 40, 45, 50, 55, 60],
    value2: [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    unit1: ['°C', 'atm', 'L', 'mol', 'M'],
    unit2: ['min', 'g', 'cm²', 'units', 'M'],
    reactant1: ['HCl', 'NaOH', 'H2SO4', 'CaCl2'],
    reactant2: ['NaCl', 'CaCO3', 'NH3', 'KOH'],
    parameter: ['temperature', 'concentration', 'pressure'],
    value: [25, 30, 35, 40, 45],
    unit: ['°C', 'M', 'atm'],
    product_property: ['yield', 'concentration', 'mass'],
    substance: ['HCl', 'NaOH', 'H2SO4', 'NH3'],
    property: ['concentration', 'volume', 'mass'],
    target_value: ['pH', 'molarity', 'mass']
  },
  mathematics: {
    variable: ['x', 'y', 'z', 't', 'n', 'θ'],
    geometric_shape: ['triangle', 'circle', 'rectangle', 'parallelogram', 'trapezoid', 'ellipse'],
    dimension1: ['length', 'width', 'radius', 'height', 'base', 'side'],
    dimension2: ['width', 'height', 'diameter', 'angle', 'altitude', 'diagonal'],
    value1: [5, 8, 10, 12, 15, 18, 20, 24],
    value2: [3, 4, 6, 7, 9, 11, 14, 16],
    unit: ['cm', 'm', 'mm', 'inches'],
    equation_part1: ['2x + 3', 'x²', 'log(x)', 'sin(x)'],
    equation_part2: ['5y - 1', 'y + 4', '3z', 'cos(y)'],
    function_type: ['x² + 2x', 'sin(x)', 'e^x', 'log(x)'],
    parameter: ['a', 'b', 'c', 'k'],
    target: ['f(2)', 'f\'(x)', 'maximum', 'minimum'],
    calculation_target: ['area', 'perimeter', 'volume', 'surface area']
  },
  programming: {
    language: ['Python', 'Java', 'JavaScript', 'C++'],
    task: ['sorts an array', 'searches for elements', 'calculates fibonacci', 'reverses a string'],
    param_type: ['integer array', 'string', 'number', 'object'],
    return_type: ['boolean', 'integer', 'string', 'array'],
    algorithm: ['binary search', 'quick sort', 'depth-first search', 'breadth-first search'],
    constraint: ['O(n log n) time complexity', 'constant space', 'recursive approach'],
    requirement: ['handles edge cases', 'validates input', 'optimized performance'],
    data_structure: ['binary tree', 'hash table', 'linked list', 'stack'],
    operation1: ['insert', 'search', 'delete', 'traverse'],
    operation2: ['update', 'find minimum', 'find maximum', 'size'],
    complexity: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)']
  }
};
