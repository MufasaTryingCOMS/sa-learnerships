// This test checks that the opportunities/controller.js file loads. 
// It is very basic and a requirement for the code coverage threashold to be greater than zero
const controller = require('../../opportunities/controller.js');

describe('Opportunities Controller', () => {
	it('should load', () => {
		expect(controller).toBeDefined();
	});
});