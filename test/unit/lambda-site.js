import lambdaSite from '../../src/lambda-site';

describe('lambdaSite', () => {
  describe('Greet function', () => {
    beforeEach(() => {
      spy(lambdaSite, 'greet');
      lambdaSite.greet();
    });

    it('should have been run once', () => {
      expect(lambdaSite.greet).to.have.been.calledOnce;
    });

    it('should have always returned hello', () => {
      expect(lambdaSite.greet).to.have.always.returned('hello');
    });
  });
});
