var fs = require('fs');

var CSVWriter = function(filename){
	console.log('filename is '+filename)
	this.filename = filename;
	this.data = '';
};

CSVWriter.prototype.write = function(row){
	this.data += JSON.stringify(row).slice(0,-1).slice(1) + '\n';
	console.log('this.data is '+JSON.stringify(this.data));
}

CSVWriter.prototype.save = function(callback){
	console.log('+++++++++++++++++i am called from the module to save the data+++++++++++++++++++++++++++++++++++');

	fs.writeFile(this.filename, this.data, 'utf8', function (err) {
		console.log('filename inside fs.writeFile is  '+JSON.stringify(this.filename))
		console.log('data inside fs.writeFile is  '+JSON.stringify(this.data))
		if (err) {
			callback(err);
  		} else{
	    	callback("success");
  		}
	});
}

module.exports = CSVWriter;