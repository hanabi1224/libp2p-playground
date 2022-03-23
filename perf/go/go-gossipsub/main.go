package main

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"sync"
	"time"

	"github.com/libp2p/go-libp2p-core/peer"
	"github.com/libp2p/go-libp2p-core/peerstore"
)

const (
	TOPIC              = "news"
	PRINT_RECEIVED_MSG = false
	PRINT_AVG_LATENCY  = true
)

var (
	CTX       = context.Background()
	N_NODES   = 10
	N_CONNECT = 3
	wg        = sync.WaitGroup{}
)

func main() {
	nArgs := len(os.Args)
	println(nArgs)
	if nArgs > 1 {
		if n, err := strconv.Atoi(os.Args[1]); err == nil {
			N_NODES = n
		}
	}
	if nArgs > 2 {
		if n, err := strconv.Atoi(os.Args[2]); err == nil {
			N_CONNECT = n
		}
	}
	fmt.Printf("N_NODES: %d, N_CONNECT: %d\n", N_NODES, N_CONNECT)
	nodes := make([]*P2PNode, 0, N_NODES)
	id2Node := make(map[peer.ID]*P2PNode, N_NODES)
	println("Creating nodes")
	wg.Add(N_NODES)
	for i := 0; i < N_NODES; i++ {
		node := createPeer(i)
		nodes = append(nodes, &node)
		id2Node[node.host.ID()] = &node
	}
	println("Connecting nodes")
	for i, node := range nodes {
		for j := 1; j <= N_CONNECT; j++ {
			other := nodes[(i+j)%N_NODES]
			node.host.Peerstore().AddAddrs(other.host.ID(), other.host.Addrs(), peerstore.PermanentAddrTTL)
			err := node.host.Connect(CTX, peer.AddrInfo{ID: other.host.ID(), Addrs: other.host.Addrs()})
			if err != nil {
				fmt.Fprint(os.Stderr, err)
			}
		}
	}
	time.Sleep(1 * time.Second)
	for _, node := range nodes {
		go node.readLoop()
		node.publishMessage()
	}
	wg.Wait()
}
