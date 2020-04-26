const TypeInsurance = require('type-insurance').default;
const _rungeKutta = require('.');
const rungeKutta = _rungeKutta.default;
const {
	_scalarMult,
	_vectorAdd,
	StepSizeDivisibilityError,
	UndependentVariableError,
} = _rungeKutta;

test('scalar multiplication', () => {
	expect(() => _scalarMult(undefined, undefined)).toThrow(TypeError);
	expect(() => _scalarMult(null, undefined)).toThrow(TypeError);
	expect(() => _scalarMult(false, undefined)).toThrow(TypeError);
	expect(() => _scalarMult('0', undefined)).toThrow(TypeError);
	expect(() => _scalarMult(0, undefined)).toThrow(TypeError);
	//expect(() => _scalarMult(undefined, [])).toThrow(TypeError);
	//expect(() => _scalarMult(undefined, [undefined])).toThrow(TypeError);
	//expect(() => _scalarMult(0, ['1', 2, 3])).toThrow(TypeError);
	expect(_scalarMult(0, [1, 2, 3])).toEqual([0, 0, 0]);
	expect(_scalarMult(1, [1, 2, 3])).toEqual([1, 2, 3]);
	expect(_scalarMult(2, [1, 2, 3])).toEqual([2, 4, 6]);
});

test('vector addition', () => {
	expect(() => _vectorAdd(undefined, undefined)).toThrow(TypeError);
	expect(() => _vectorAdd(null, undefined)).toThrow(TypeError);
	expect(() => _vectorAdd(false, undefined)).toThrow(TypeError);
	expect(() => _vectorAdd('0', undefined)).toThrow(TypeError);
	expect(() => _vectorAdd(0, undefined)).toThrow(TypeError);
	expect(() => _vectorAdd(undefined, [])).toThrow(TypeError);
	expect(() => _vectorAdd([undefined], undefined)).toThrow(TypeError);
	expect(() => _vectorAdd(0, ['1', 2, 3])).toThrow(TypeError);
	expect(_vectorAdd([0, 0, 0], [1, 2, 3])).toEqual([1, 2, 3]);
	expect(_vectorAdd([1, 1, 1], [1, 2, 3])).toEqual([2, 3, 4]);
	expect(_vectorAdd([1, 2, 3], [1, 2, 3])).toEqual([2, 4, 6]);
});

const _roundResults = input => {
	const { array } = new TypeInsurance(input);
	return array.map(x => Math.round(x));
}

test('Runge-Kutta approximation for single variable problem', () => {
	const dy = (t, y) => y;
	const approximation1 = rungeKutta(dy, 1, 0, 5, .2)
		.filter((x, i) => i % 5 === 0);
	const approximation2 = rungeKutta(dy, [1], 0, 5, .2)
		.filter((x, i) => i % 5 === 0);
	const exact = [0, 1, 2, 3, 4, 5].map(x => Math.exp(x));

	expect(_roundResults(approximation1)).toEqual(_roundResults(exact));
	expect(_roundResults(approximation2)).toEqual(_roundResults(exact));
});

test('Runge-Kutta approximation for a multi variable problem', () => {
	const T = .2143, R = 1/14;
	const dSIR = (t, y) => [-T * y[0] * y[1], (T * y[0] - R) * y[1], R * y[1]];

	expect(rungeKutta(dSIR, [1, .1, 0], 0, 2, .2).map(x => x[1]))
		.toEqual([
			.1,
			.10288911725369337,
			.10584178432113003,
			.10885820395730433,
			.1119385009922973,
			.1150827180559903,
			.1182908113115604,
			.12156264621716173,
			.12489799333649376,
			.12829652422020563,
			.13175780738126958,
		]);
});

test('rungeKutta errors', () => {
	expect(() => rungeKutta((t, y) => t * y, 1, 2, 1, 1))
		.toThrow(UndependentVariableError);
	expect(() => rungeKutta((t, y) => t * y, 1, 0, 1, .4))
		.toThrow(StepSizeDivisibilityError);

	expect(() => rungeKutta(
		(t, y) => [y[0] * y[1] + t, y[0] + y[1] - t],
		[1, 1], 2, 1, 1
	)).toThrow(UndependentVariableError);
	expect(() => rungeKutta(
		(t, y) => [y[0] * y[1] + t, y[0] + y[1] - t],
		1, 0, 2, .8
	)).toThrow(StepSizeDivisibilityError);
});
