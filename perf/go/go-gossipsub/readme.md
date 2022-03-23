# Commands

```
go mod vendor
go run . 10 3
go run . 100 3
```

# Results

```
N_NODES: 10, N_CONNECT: 3
Creating nodes
Connecting nodes
Starting pubsub
node 9 msg latency, avg: 6.666667ms, max: 12ms, min: 2ms
node 2 msg latency, avg: 2.000000ms, max: 3ms, min: 1ms
node 6 msg latency, avg: 3.777778ms, max: 8ms, min: 1ms
node 0 msg latency, avg: 2.000000ms, max: 3ms, min: 1ms
node 7 msg latency, avg: 4.333333ms, max: 9ms, min: 1ms
node 3 msg latency, avg: 2.444444ms, max: 5ms, min: 1ms
node 4 msg latency, avg: 2.666667ms, max: 6ms, min: 1ms
node 5 msg latency, avg: 3.222222ms, max: 7ms, min: 1ms
node 1 msg latency, avg: 2.222222ms, max: 4ms, min: 1ms
node 8 msg latency, avg: 5.888889ms, max: 10ms, min: 2ms
```

```
N_NODES: 100, N_CONNECT: 3
Creating nodes
Connecting nodes
Starting pubsub
node 1 msg latency, avg: 59.303030ms, max: 155ms, min: 2ms
node 0 msg latency, avg: 61.030303ms, max: 155ms, min: 1ms
node 42 msg latency, avg: 70.626263ms, max: 146ms, min: 16ms
node 3 msg latency, avg: 61.464646ms, max: 156ms, min: 4ms
node 4 msg latency, avg: 60.454545ms, max: 155ms, min: 4ms
node 9 msg latency, avg: 63.494949ms, max: 157ms, min: 7ms
node 2 msg latency, avg: 62.545455ms, max: 158ms, min: 3ms
node 43 msg latency, avg: 106.868687ms, max: 215ms, min: 14ms
node 44 msg latency, avg: 71.191919ms, max: 134ms, min: 19ms
node 7 msg latency, avg: 62.010101ms, max: 158ms, min: 4ms
node 28 msg latency, avg: 71.101010ms, max: 158ms, min: 16ms
node 5 msg latency, avg: 61.797980ms, max: 156ms, min: 5ms
node 39 msg latency, avg: 92.040404ms, max: 190ms, min: 16ms
node 41 msg latency, avg: 73.191919ms, max: 143ms, min: 17ms
...
```
