console.log('Loading function!!!');



exports.handler = function(event, context) {
  console.log('value1 =', event.key1);
  console.log('value2 =', event.key2);
  console.log('value3 =', event.key3);

  console.log('running function!!!');
  context.succeed('dudududududududududududuududududude');
};
