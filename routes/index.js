var express = require('express');
var router = express.Router();
var fs = require('fs');
var g = require('glob');


/* GET home page. */
/*mem.swaptarget.average_10-20-2015-10-41-vmstat.csv*/
router.get('/', function(req, res, next) {
    console.log("into ");

    g('public/data/*/csv/*csv', function (er, files) {
        if (er) { console.log(er);}
        console.log("F: " + files);
        var tmpCollArr = new Array();
        var tmpArr = new Array();
        var tmpSanArr = new Array();
        files.forEach(function(val) {
            var tmpnewValArr = val.split('-');
            console.log("NWX: " + JSON.stringify(tmpnewValArr));

            tmpnewValArr.shift();
            tmpnewValArr.pop();

            var newVal = tmpnewValArr.join('-');
            console.log("NW: " + newVal);
            if (tmpArr.indexOf(newVal) == -1) {
                if (val.match(/vm/)) {
                    console.log("VM");
                    tmpArr.push(newVal);
                }
            }
            if (tmpSanArr.indexOf(newVal) == -1) {
                if (val.match(/emc/)) {
                    console.log("MS");
                    tmpSanArr.push(newVal);
                }
            }
        });

        var newArr = tmpArr.map(function(val) {
            return {'name': val};

        });

        var newSANArr = tmpSanArr.map(function(val) {
            return {'name': val};

        });

        var luns = [
            {'name':'Data-Lun11'},
            {'name':'Data-Lun12'},
            {'name':'Data-Lun13'},
            {'name':'Data-Lun-14'},
            {'name':'Data-Lun20 - SAS'}
        ];

        var metricsSAN = [
            {'name':'Object Name' ,'value':'Object_Name'},
            {'name':'Poll Time' ,'value':'Poll_Time'},
            {'name':'Utilization ' ,'value':'Utilization_'},
            {'name':'Queue Length' ,'value':'Queue_Length'},
            {'name':'Response Time ms' ,'value':'Response_Time_ms'},
            {'name':'Total Bandwidth MBs' ,'value':'Total_Bandwidth_MBs'},
            {'name':'Total Throughput IOs' ,'value':'Total_Throughput_IOs'},
            {'name':'Read Bandwidth MBs' ,'value':'Read_Bandwidth_MBs'},
            {'name':'Read Size KB' ,'value':'Read_Size_KB'},
            {'name':'Read Throughput IOs' ,'value':'Read_Throughput_IOs'},
            {'name':'Write Bandwidth MBs' ,'value':'Write_Bandwidth_MBs'},
            {'name':'Write Size KB' ,'value':'Write_Size_KB'},
            {'name':'Write Throughput IOs' ,'value':'Write_Throughput_IOs'},
            {'name':'Average Busy Queue Length','value':'Average_Busy_Queue_Length'},
            {'name':'Service Time ms' ,'value':'Service_Time_ms'},
            {'name':'Average Seek Distance GB','value':'Average_Seek_Distance_GB'}
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
            sanfiles: newSANArr,
            metrics: metrics,
            metricsSAN: metricsSAN,
            luns:luns,
            title: 'Viz VM'
        });
    });

});

module.exports = router;
