var assert = require('assert');
var fs = require('fs');
var path = require('path');
var parser = require('../lib').parser;
var Compiler = require('../lib/compiler');

describe('Compiler', function() {
  it('compiles background', function() {
    var source = fs.readFileSync(path.join(__dirname, '../../testdata/good/with_background.feature'), 'UTF-8');
    var feature = parser.parse(source);
    var units = new Compiler().compile(feature);
    assert.equal(2, units.length);
    assert.equal(2, units[0].steps.length);

    assert.equal('a background step', units[0].steps[0].name.value);
    assert.equal(4, units[0].steps[0].name.locations[0].first_line);

    assert.equal('I have 3 more cukes in my belly', units[0].steps[1].name.value);
    assert.equal(7, units[0].steps[1].name.locations[0].first_line);
  });

  it('compiles scenario outline', function() {
    var source = fs.readFileSync(path.join(__dirname, '../../testdata/good/with_scenario_outline.feature'), 'UTF-8');
    var feature = parser.parse(source);
    var units = new Compiler().compile(feature);
    assert.equal(3, units.length);

    assert.equal('a background <n> step', units[1].steps[0].name.value);

    step_1_1_name = units[1].steps[1].name;
    assert.equal('I have 20 cukes (20) in my belly', step_1_1_name.value);
    assert.equal( 8, step_1_1_name.locations[0].first_line);
    assert.equal(20, step_1_1_name.locations[1].first_line);

    step_1_1_docstring = units[1].steps[1].multiline_arg;
    var expected_doc_string = 
      "      A doc\n" +
      "      string 40 gets\n" +
      "      variables 20 replaced\n";
    assert.equal(expected_doc_string, step_1_1_docstring.string());

    assert.equal('I eat 20 cukes', units[1].steps[2].name.value);
    assert.equal('I should have 40 cukes in my belly', units[1].steps[3].name.value);
  });
});