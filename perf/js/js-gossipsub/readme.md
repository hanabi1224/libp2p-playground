# Commands

```
yarn
yarn build
# 10 nodes
yarn main 10
# 100 nodes
yarn main 100
# Run node profiler
yarn prof 10
# Generate aggregated profiler report
node --prof-process isolate-0xblabla > perf.log
# Profile with valgrind, and generate a graphic report perf.svg with gprof2dot and dot
./profiler.sh
```

# Output

```
N_NODES: 100
[100] node 93 msg latency, avg: 3502.252525252525ms, max: 4642ms, min: 211ms
[99] node 83 msg latency, avg: 3205.4444444444443ms, max: 5300ms, min: 204ms
[98] node 84 msg latency, avg: 3238.6666666666665ms, max: 5307ms, min: 204ms
[97] node 85 msg latency, avg: 3261.656565656566ms, max: 5313ms, min: 205ms
[96] node 86 msg latency, avg: 3288.969696969697ms, max: 5318ms, min: 206ms
[95] node 87 msg latency, avg: 3319.252525252525ms, max: 5323ms, min: 206ms
[94] node 88 msg latency, avg: 3347.989898989899ms, max: 5328ms, min: 207ms
[93] node 89 msg latency, avg: 3377.4949494949497ms, max: 5332ms, min: 209ms
[92] node 90 msg latency, avg: 3410.5353535353534ms, max: 5335ms, min: 209ms
[91] node 91 msg latency, avg: 3445.222222222222ms, max: 5336ms, min: 210ms
[90] node 92 msg latency, avg: 3475.010101010101ms, max: 5342ms, min: 210ms
[89] node 81 msg latency, avg: 3168.6363636363635ms, max: 5646ms, min: 203ms
[88] node 82 msg latency, avg: 3187.656565656566ms, max: 5648ms, min: 203ms
[87] node 79 msg latency, avg: 3141.3636363636365ms, max: 5820ms, min: 201ms
[86] node 80 msg latency, avg: 3154.050505050505ms, max: 5821ms, min: 201ms
[85] node 77 msg latency, avg: 3128ms, max: 6159ms, min: 197ms
[84] node 78 msg latency, avg: 3133.5858585858587ms, max: 6159ms, min: 200ms
[83] node 75 msg latency, avg: 3122.7272727272725ms, max: 6310ms, min: 195ms
[82] node 76 msg latency, avg: 3125.929292929293ms, max: 6310ms, min: 196ms
[81] node 73 msg latency, avg: 3127.929292929293ms, max: 6524ms, min: 194ms
[80] node 74 msg latency, avg: 3123.2929292929293ms, max: 6525ms, min: 194ms
...
```

```
N_NODES: 10
[10] node 7 msg latency, avg: 66.55555555555556ms, max: 81ms, min: 41ms
[9] node 8 msg latency, avg: 73.11111111111111ms, max: 90ms, min: 23ms
[8] node 9 msg latency, avg: 88.22222222222223ms, max: 105ms, min: 25ms
[7] node 0 msg latency, avg: 91.33333333333333ms, max: 116ms, min: 26ms
[6] node 5 msg latency, avg: 76ms, max: 137ms, min: 37ms
[5] node 6 msg latency, avg: 69.33333333333333ms, max: 139ms, min: 38ms
[4] node 1 msg latency, avg: 107.11111111111111ms, max: 154ms, min: 29ms
[3] node 2 msg latency, avg: 99.77777777777777ms, max: 159ms, min: 31ms
[2] node 3 msg latency, avg: 93.55555555555556ms, max: 169ms, min: 33ms
[1] node 4 msg latency, avg: 84.33333333333333ms, max: 171ms, min: 35ms
```
