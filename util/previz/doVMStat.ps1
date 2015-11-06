################################################################################
# 
# 
# http://virtualcurtis.wordpress.com
# 
################################################################################
# 
# 
# 
# 
#
################################################################################


param($minusminutes)
$datastores = "Data-Lun11","Data-Lun12","Data-Lun13","Data-Lun-14","Data-Lun20 - SAS"
$server = "vcenter-01.smk.dk"
$metrics = "disk.numberWrite.summation","disk.write.average","disk.numberWriteAveraged.average","virtualDisk.numberWriteAveraged.average","virtualDisk.write.average","virtualDisk.totalWriteLatency.average","datastore.numberWriteAveraged.average","datastore.write.average","datastore.totalWriteLatency.average","virtualDisk.writeOIO.latest","virtualDisk.writeLoadMetric.latest","mem.activewrite.average","cpu.ready.summation","disk.numberRead.summation","disk.read.average","disk.numberReadAveraged.average","virtualDisk.numberReadAveraged.average","virtualDisk.read.average","virtualDisk.totalReadLatency.average","datastore.numberReadAveraged.average","datastore.read.average","datastore.totalReadLatency.average","virtualDisk.readOIO.latest","virtualDisk.readLoadMetric.latest","mem.swapped.average","mem.swaptarget.average","mem.swapinRate.average","mem.swapoutRate.average","cpu.swapwait.summation","mem.swapin.average","mem.swapout.average","mem.llSwapInRate.average","mem.llSwapOutRate.average"
# add VMware PS snapin
if (-not (Get-PSSnapin VMware.VimAutomation.Core -ErrorAction SilentlyContinue)) {
    Add-PSSnapin VMware.VimAutomation.Core
}

$logFile = "C:\temp\check_VMstat.log"

function LogLine( [String]$row = $(Throw 'LogLine:$row unspecified')) {
  $logDateTime = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
  Add-Content -Encoding UTF8 $logFile ($logDateTime + " - " + $row) 
}

# function to get iops for a vm on a particular host
function GetStat($vm,$ds,$minusminutes,$metrics){
    LogLine($vm)
    LogLine($ds)
    LogLine($minusminutes)
    
    # identify device id for datastore
    $myDatastoreID = ((Get-Datastore $ds ) | Get-View).info.vmfs.extent[0].diskname
    
    $rawVMStats = get-stat -stat $metrics -entity (get-vm $vm ) -Start (get-date).AddDays(-$(echo "$minusminutes"))
    $results = @()
    
    foreach ($stat in $rawVMStats) {
      $results += $stat.Value
    }
  return $rawVMStats
}


$dataArray = @()
foreach ($datastore in $datastores) {
  # Grab datastore and find VMs on that datastore
  $myDatastore = Get-Datastore -Name "$datastore"
  $myVMs = Get-VM -Datastore "$myDatastore" | Where {$_.PowerState -eq "PoweredOn"}
  
  # Gather current IO snapshot for each VM
  foreach ($vm in $myVMs) {
    $retVal = GetStat $vm.name $datastore $minusminutes $metrics
    $retVal | Add-Member -MemberType NoteProperty -Name "Lun" -Value $datastore
    $dataArray += $retVal
  }
}
$dateName=Get-Date -f MM-dd-yyyy-HH-mm
$dataArray | Export-CSV -Encoding UTF8 -NoType -Path "n:\windows\vm\${dateName}-vmstat.csv"
