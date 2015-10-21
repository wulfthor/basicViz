var express = require('express');
var router = express.Router();
var fs = require('fs');
var g = require('glob');


/* GET home page. */
/*mem.swaptarget.average_10-20-2015-10-41-vmstat.csv*/
router.get('/', function(req, res, next) {
    console.log("into ");
    g('public/data/vm/csv/*', function (er, files) {
        if (er) { console.log(er);}
        console.log(files);
        var tmpArr = new Array();
        files.forEach(function(val) {
            var tmpnewValArr = val.split('-');
            tmpnewValArr.shift();
            tmpnewValArr.pop();

            var newVal = tmpnewValArr.join('-');
            console.log(newVal);
            if (tmpArr.indexOf(newVal) == -1) {
                tmpArr.push(newVal);
            }
        });

        var newArr = tmpArr.map(function(val) {
            return {'name': val};

        });


        var luns = [
            {'name':'Data-Lun11'},
            {'name':'Data-Lun12'},
            {'name':'Data-Lun13'},
            {'name':'Data-Lun-14'},
            {'name':'Data-Lun20 - SAS'}
        ];
        var metrics = [
            {'name': 'cpu ready summation', 'value':'cpu.ready.summation'},
            {'name': 'cpu swapwait summation', 'value':'cpu.swapwait.summation'},
            {'name': 'datastore numberreadaveraged average', 'value':'datastore.numberreadaveraged.average'},
            {'name': 'datastore numberwriteaveraged average', 'value':'datastore.numberwriteaveraged.average'},
            {'name': 'datastore read average', 'value':'datastore.read.average'},
            {'name': 'datastore totalreadlatency average', 'value':'datastore.totalreadlatency.average'},
            {'name': 'datastore totalwritelatency average', 'value':'datastore.totalwritelatency.average'},
            {'name': 'datastore write average', 'value':'datastore.write.average'},
            {'name': 'disk numberreadaveraged average', 'value':'disk.numberreadaveraged.average'},
            {'name': 'disk numberread summation', 'value':'disk.numberread.summation'},
            {'name': 'disk numberwriteaveraged average', 'value':'disk.numberwriteaveraged.average'},
            {'name': 'disk numberwrite summation', 'value':'disk.numberwrite.summation'},
            {'name': 'disk read average', 'value':'disk.read.average'},
            {'name': 'disk write average', 'value':'disk.write.average'},
            {'name': 'mem activewrite average', 'value':'mem.activewrite.average'},
            {'name': 'mem llswapinrate average', 'value':'mem.llswapinrate.average'},
            {'name': 'mem llswapoutrate average', 'value':'mem.llswapoutrate.average'},
            {'name': 'mem swapin average', 'value':'mem.swapin.average'},
            {'name': 'mem swapinrate average', 'value':'mem.swapinrate.average'},
            {'name': 'mem swapout average', 'value':'mem.swapout.average'},
            {'name': 'mem swapoutrate average', 'value':'mem.swapoutrate.average'},
            {'name': 'mem swapped average', 'value':'mem.swapped.average'},
            {'name': 'mem swaptarget average', 'value':'mem.swaptarget.average'},
            {'name': 'virtualdisk numberreadaveraged average', 'value':'virtualdisk.numberreadaveraged.average'},
            {'name': 'virtualdisk numberwriteaveraged average', 'value':'virtualdisk.numberwriteaveraged.average'},
            {'name': 'virtualdisk read average', 'value':'virtualdisk.read.average'},
            {'name': 'virtualdisk readloadmetric latest', 'value':'virtualdisk.readloadmetric.latest'},
            {'name': 'virtualdisk readoio latest', 'value':'virtualdisk.readoio.latest'},
            {'name': 'virtualdisk totalreadlatency average', 'value':'virtualdisk.totalreadlatency.average'},
            {'name': 'virtualdisk totalwritelatency average', 'value':'virtualdisk.totalwritelatency.average'},
            {'name': 'virtualdisk write average', 'value':'virtualdisk.write.average'},
            {'name': 'virtualdisk writeloadmetric latest', 'value':'virtualdisk.writeloadmetric.latest'},
            {'name': 'virtualdisk writeoio latest', 'value':'virtualdisk.writeoio.latest'}
        ];
        res.render('partials/index', {
            mfiles: newArr,
            metrics: metrics,
            luns:luns,
            title: 'Viz VM'
        });
    });

});

module.exports = router;
