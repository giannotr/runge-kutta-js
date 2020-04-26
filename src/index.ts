type initialValueFunction = (x: number, y: any) => any;
type initialValueFunctionSingle = (x: number, y: number) => number;
type initialValueFunctionMulti = (x: number, y: readonly number[]) => number[];

interface AuxArgs {
	start: number;
	stepSize: number;
	steps: number;
}

interface AuxArgsSingle extends AuxArgs {
	equation: initialValueFunctionSingle;
	initialCondition: number;
}

interface AuxArgsMulti extends AuxArgs {
	equation: initialValueFunctionMulti;
	initialCondition: number[];
}

export const _scalarMult = (
	scalar: number,
	vector: readonly number[],
) => vector.map(x => scalar * x);

export const _vectorAdd = (
	a: readonly number[],
	b: readonly number[],
) => a.map((x, i) => x + b[i]);

export const UndependentVariableError = new Error(
	'The destination of the undependent variable has to be greater than its start'
);

export const StepSizeDivisibilityError = new Error(
	'The range has to be an divisible by the step size'
);

export default function(
	ODE: initialValueFunction,
	initialCondition: number | number[],
	range: readonly [number, number],
	stepSize = 1,
): number[] | number[][] {
	const [t0, tn] = range;
	let _return;

	if(tn > t0) {
		const steps = (tn - t0) / stepSize;
		const args = {
			equation: ODE,
			start: t0,
			stepSize,
			steps,
		};

		if(Number.isInteger(steps)) {
			if(typeof initialCondition === 'object' && initialCondition.length > 1) {
				_return = rungeKuttaMulti({...args, initialCondition});
			} else {
				let _initialCondition: number;

				if(typeof initialCondition === 'object') {
					// The length of the initialCondition is 1
					[_initialCondition] = initialCondition;
				} else {
					_initialCondition = initialCondition;
				}

				_return = rungeKutta1d({...args, initialCondition: _initialCondition});
			}

			return _return;
		}

		throw StepSizeDivisibilityError;
	}

	throw UndependentVariableError;
}

const rungeKutta1d = (args: AuxArgsSingle): number[] => {
	const {
		equation,
		initialCondition,
		start,
		stepSize,
		steps,
	} = args;

	const f = equation;
	const n = steps;
	const h = stepSize;
	const y = [initialCondition, ...new Array(n).fill(0)];

	let t = start;
	let i = 0;
	let k1: number, k2: number, k3: number, k4: number;

	while(i < n) {
		k1 = f(t, y[i]);
		k2 = f(t + (.5 * h), y[i] + (.5 * h * k1));
		k3 = f(t + (.5 * h), y[i] + (.5 * h * k2));
		k4 = f(t + h, y[i] + (h * k3));

		y[i + 1] = y[i] + (h * (k1 + (2 * k2) + (2 * k3) + k4) / 6);
		t += h;
		i++;
	}

	return y;
};

const rungeKuttaMulti = (args: AuxArgsMulti): number[][] => {
	const {
		equation,
		initialCondition,
		start,
		stepSize,
		steps,
	} = args;

	const f = equation;
	const n = steps;
	const h = stepSize;
	const y = [initialCondition];
	const m = initialCondition.length;

	let t = start;
	let i = 0;
	let k1: number[], k2: number[], k3: number[], k4: number[];

	while(i < n) {
		const yNext = [];

		k1 = f(t, y[i]);
		k2 = f(t + (.5 * h), _vectorAdd(y[i], _scalarMult(.5 * h, k1)));
		k3 = f(t + (.5 * h), _vectorAdd(y[i], _scalarMult(.5 * h, k2)));
		k4 = f(t + h, _vectorAdd(y[i], _scalarMult(h, k3)));

		for(let k = 0; k < m; k++) {
			yNext.push(y[i][k] + (h * (k1[k] + (2 * k2[k]) + (2 * k3[k]) + k4[k]) / 6));
		}

		y.push(yNext);
		t += h;
		i++;
	}

	return y;
};
