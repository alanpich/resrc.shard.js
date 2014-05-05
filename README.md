# ReSRC "Server Sharding" Plugin

Domain sharding is a technique to accelerate page load times by tricking browsers into opening more simultaneous connections than are normally allowed. It's a widely-used optimization tactic that enables browsers to make better use of high-bandwidth internet connections.

Mobile Users however beware! Domain sharding is not a best practice.

Additional network connections above and beyond the recommended limits are not "free". Each connection comes with a setup overhead in the form of a DNS lookup and a TCP 3-Way handshake, as well as TCP slow start. For mobile browsers, the resulting latency is much higher than for desktop users. In addition many mobile browsers implement HTTP pipelining and no longer observe the old HTTP/1.1 connection rules.

## Usage

1. Include [resrc.js](http://use.resrc.it/0.7):

  ```html
  <script src="//use.resrc.it/0.7"></script>
  ```

2. Include the plugin:

  ```html
  <script src="/dist/resrc.shard.min.js"></script>
  ```

3. Call the plugin:

  ```javascript
  resrc.ready(function () {
    resrc.shard();
  });
  ```
  
4. Or call the plugin and set your own defaults:
  
  ```javascript
  resrc.ready(function () {
    resrc.shard({servers : ["app1.resrc.it", "app2.resrc.it"]});
  });
  ```

## Building a minified release

The repository does not contain a minified resrc.shard.min.js file - this is only generated
for [RELEASES](https://github.com/resrcit/resrc.shard.js/releases). To build your own minified copy
for use in development simply run ```npm install``` if you haven't already, followed by ```grunt build```.
This will generate a resrc.shard.min.js file in the `dist` subdirectory.

## History

For a full list of releases and changes please see the [CHANGELOG](https://github.com/resrcit/resrc.shard.js/blob/master/CHANGELOG.md).

## Contributing

Please see the [CONTRIBUTING](https://github.com/resrcit/resrc.shard.js/blob/master/CONTRIBUTING.md) file for guidelines.

## Contact

Please get in touch via: [EMAIL](mailto:support@resrc.it).

## License

Copyright (C) 2014 by [ReSRC LTD](http://www.resrc.it) - The MIT License (MIT)  
Please see [LICENSE](https://github.com/resrcit/resrc.shard.js/blob/master/LICENSE).