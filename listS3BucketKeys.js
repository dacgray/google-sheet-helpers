/**
* Lists keys in bucket with initial chars as searchString.
*
* @param {string} accessKeyId your AWS AccessKeyId.
* @param {string} secretAccessKey your AWS SecretAccessKey.
* @param {string} bucket name of the bucket.
* @param {string} searchString a string of the search prefix.  Invokes in psuedo code `keys LIKE searchString%`.
* @param {string} uriPrefix a URI prefix to preprend to the output.
* @customfunction
* @return a two-dimensional array containing the data.
**/
function listBucketKeys(accessKeyId, secretAccessKey, bucket, searchString, uriPrefix = '')
{
  var s3 = S3.getInstance(accessKeyId, secretAccessKey);

  var xml = s3.getObject(bucket, "?list-type=2&prefix=" + searchString,{logRequests:false});

  var document = XmlService.parse(xml.getDataAsString());

  var root = document.getRootElement();
  var atom = XmlService.getNamespace('http://s3.amazonaws.com/doc/2006-03-01/');

  var entries = root.getChildren('Contents', atom);

  if (entries.length === 0) {
    return [[""]];
  }

  var list = new Array;
  list.push([]);

  for (var i = 0; i < entries.length; i++) {
    var key = entries[i].getChild('Key', atom).getText();

    if (key.indexOf('.DS_Store') === -1 && key !== searchString + '/') {
      list[0].push(uriPrefix + key);
    }
  }

  return list;
}
