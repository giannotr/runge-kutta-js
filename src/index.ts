type initialValueFunction = (x: number, y: any) => any;
type initialValueFunctionSingle = (x: number, y: number) => number;
type initialValueFunctionMulti = (x: number, y: readonly number[]) => number[];

export const _scalarMult = (scalar: number, vector: readonly number[]) => vector.map(x => scalar * x);
export const _vectorAdd = (a: readonly number[], b: readonly number[]) => a.map((x, i) => x + b[i]);

export const StepSizeDivisibilityError = new Error(
	'The range has to be an divisible by the step size'
);
export const UndependentVariableError = new Error(
	'The destination of the undependent variable has to be greater than its start'
);

export default function(
	f: initialValueFunction,
	y0: number | number[],
	t0: number,
	tn: number,
	h: number
) {
	let _return;

	if(typeof y0 === 'object' && y0.length > 1) {
		_return = rungeKuttaMulti(f, y0, t0, tn, h);
	} else {
		let _y0: number;

		if(typeof y0 === 'object') {// The length of y0 is 1
			[_y0] = y0;
		} else {
			_y0 = y0;
		}

		_return = rungeKutta1d(f, _y0, t0, tn, h);
	}

	return _return;
}

const rungeKutta1d = (
	f: initialValueFunctionSingle,
	y0: number,
	t0: number,
	tn: number,
	h: number
) => {
	if(tn > t0) {
		const n = (tn - t0) / h;

		if(Number.isInteger(n)) {
			const n = (tn - t0) / h;
			const y = [y0, ...new Array(n).fill(0)];

			let t = t0;
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
		}

		throw StepSizeDivisibilityError;
	} else {
		throw UndependentVariableError;
	}
};

const rungeKuttaMulti = (
	f: initialValueFunctionMulti,
	y0: readonly number[],
	t0: number,
	tn: number,
	h: number
) => {
	if(tn > t0) {
		const n = (tn - t0) / h;

		if(Number.isInteger(n)) {
			const m = y0.length;
			const y = [y0];

			let t = t0;
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
		}

		throw StepSizeDivisibilityError;
	} else {
		throw UndependentVariableError;
	}
};
