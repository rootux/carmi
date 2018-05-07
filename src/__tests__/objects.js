const { currentValues, compile, and, or, context, root, val, key, arg0, Setter, Splice } = require('../../index');
const _ = require('lodash');
const rand = require('random-seed').create();
const defaultSeed = 'CARMI';

describe('testing objects', () => {
  const funcLibrary = {
    tap: x => x
  };

  function expectTapFunctionToHaveBeenCalled(n) {
    expect(funcLibrary.tap.mock.calls.length).toEqual(n);
    funcLibrary.tap.mockClear();
  }

  beforeEach(() => {
    rand.seed(defaultSeed);
    jest.spyOn(funcLibrary, 'tap');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('values/keys', () => {
    const rangeMin = root.get('center').minus(root.get('range'));
    const rangeMax = root.get('center').plus(root.get('range'));
    const model = {
      inRange: root
        .get('numbers')
        .filterBy(val => and(val.gte(rangeMin), val.lte(rangeMax)))
        .keys()
        .keyBy(val => val.call('tap')),
      set: Setter('numbers', arg0),
      setCenter: Setter('center')
    };

    // const naiveModel = eval(compile(model, true));
    const optModel = eval(compile(model, false));
    const initialData = {
      numbers: {
        eight: 8,
        five: 5,
        twelve: 12,
        three: 3,
        ten: 10,
        one: 1
      },
      center: 4,
      range: 3
    };
    const inst = optModel(initialData, funcLibrary);
    expect(inst.inRange).toEqual({ five: 'five', three: 'three', one: 'one' });
    expectTapFunctionToHaveBeenCalled(3);
    inst.setCenter(9);
    expect(inst.inRange).toEqual({ eight: 'eight', twelve: 'twelve', ten: 'ten' });
    expectTapFunctionToHaveBeenCalled(3);
    inst.setCenter(6);
    expect(inst.inRange).toEqual({ eight: 'eight', five: 'five', three: 'three' });
    expectTapFunctionToHaveBeenCalled(2);
    inst.setCenter(2);
    expect(inst.inRange).toEqual({ five: 'five', three: 'three', one: 'one' });
    expectTapFunctionToHaveBeenCalled(1);
    inst.setCenter(10);
    expect(inst.inRange).toEqual({ eight: 'eight', twelve: 'twelve', ten: 'ten' });
    expectTapFunctionToHaveBeenCalled(3);
  });
});