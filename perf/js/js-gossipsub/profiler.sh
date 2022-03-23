#! /bin/sh

valgrind --tool=callgrind --callgrind-out-file=callgrind.out -- node dist/main.js 4
gprof2dot -f callgrind callgrind.out | dot -Tsvg -o perf.svg
