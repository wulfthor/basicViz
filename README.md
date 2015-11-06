# Project Name

Pull data from VM-environment and underlying SAN for visualization of IO

## Installation

prerequisites
- powerCLI on Windows-client 
- naviseccli on Linux-client


## Usage

VM:
Windows
- powerCLI Connect-VIServer
- doVMStat.ps1 <number-of-days> (will place stat-file "d-m-Y-H-M-vmstat.csv" on smb-drive)

Linux
- cat metrics | while read x; do grep  $x d-m-Y-H-M-vmstat.csv  > ${x}-d-m-Y-H-M-vmstat.csv ; done
- cleanData.sh <headerfile> <source-dir-of-csv> (will replace header)

SAN:
- getData.sh <ip-of-san-controller> (will get nar-files, convert to csv and fix header) 
 

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## History

TODO: Write history

## Credits

TODO: Write credits

## License

TODO: Write license