(function (resrc) {
  "use strict";
  resrc.shard = function (options) {
    
    var defaults = {
      attribute : "data-src",
      images : resrc.getElementsByClassName(resrc.options.resrcClass),
      servers : ["app1.resrc.it", "app2.resrc.it", "app3.resrc.it", "app4.resrc.it"]
    };
    
    var settings = resrc.extend(defaults, options);
    var imgs = settings.images;
    
    var serverShard = function (i, resrcServerArray) {
      return resrcServerArray[i % resrcServerArray.length];
    };
    
    var getDomainName = function (data) {
      var a = document.createElement("a");
      a.href = data;
      return a.hostname;
    };
    
    // If an element is found.
    if (imgs) {
      
      // Loop over each element.
      for (var i = 0; i < imgs.length; i++) {
        
        // Create a reference to the new server address.
        var server = serverShard(i, settings.servers);
        
        // Create a reference to the resrc image path by calling the resrc.getResrcImageObject public method.
        var imgPath = resrc.getResrcImageObject(imgs[i]).resrcImgPath;
        
        // Replace the existing server domain name with the new "sharded" server domain.
        var shardedImgPath = imgPath.replace(getDomainName(imgPath), server);
        
        // Set the resrc image attribute to be the sharded image path.
        imgs[i].setAttribute(settings.attribute, shardedImgPath);
        
        // Set the data-server attribute so that all subsequent requests come from the same server.
        imgs[i].setAttribute("data-server", server);
        
        // Call the resrc.resrc public method passing in the image element as the argument. 
        resrc.resrc(imgs[i]);
      }
   
    }
    
  };
  
  return resrc;
  
}(resrc));